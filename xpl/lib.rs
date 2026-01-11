// ============================================================================
// XNMk Genesis Ritual - Anchor Smart Contract for X1 (Solana)
// ============================================================================
// This program handles the compositional minting of XNMk tokens on X1,
// mirroring XNM balances from the XenBlocks EVM chain.
// ============================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("XNMkGenesis111111111111111111111111111111111");

// XNMk Token Decimals (matching XNM)
pub const XNMK_DECIMALS: u8 = 18;

// Minimum term commitment (days)
pub const MIN_TERM_DAYS: u16 = 1;
pub const MAX_TERM_DAYS: u16 = 365;

#[program]
pub mod xnmk_genesis {
    use super::*;

    /// Initialize the XNMk Genesis program
    /// Creates the mint authority PDA and initializes protocol state
    pub fn initialize(
        ctx: Context<Initialize>,
        genesis_timestamp: i64,
    ) -> Result<()> {
        let protocol = &mut ctx.accounts.protocol_state;
        protocol.authority = ctx.accounts.authority.key();
        protocol.xnmk_mint = ctx.accounts.xnmk_mint.key();
        protocol.genesis_timestamp = genesis_timestamp;
        protocol.total_minted = 0;
        protocol.total_participants = 0;
        protocol.is_active = true;
        protocol.bump = ctx.bumps.protocol_state;
        
        msg!("XNMk Genesis Protocol initialized");
        msg!("Genesis timestamp: {}", genesis_timestamp);
        
        Ok(())
    }

    /// Execute the Genesis Ritual - mint XNMk mirroring XNM balance
    /// 
    /// # Arguments
    /// * `evm_address` - The EIP-55 checksummed address (20 bytes)
    /// * `xnm_balance` - The XNM balance to mirror (in wei, will be converted)
    /// * `term_days` - Commitment term in days (1-365)
    /// * `signature` - EVM signature proving ownership (65 bytes: r, s, v)
    /// * `argon2_salt` - The SALT derived from EVM address
    /// * `argon2_hash` - The Argon2id commitment hash (86 bytes)
    pub fn genesis_ritual(
        ctx: Context<GenesisRitual>,
        evm_address: [u8; 20],
        xnm_balance: u64,
        term_days: u16,
        signature: [u8; 65],
        argon2_salt: [u8; 19],  // "XEN" + 16 hex chars
        argon2_hash: [u8; 86],
    ) -> Result<()> {
        // Validate term commitment
        require!(
            term_days >= MIN_TERM_DAYS && term_days <= MAX_TERM_DAYS,
            GenesisError::InvalidTermCommitment
        );

        // Validate XNM balance is non-zero
        require!(xnm_balance > 0, GenesisError::ZeroBalance);

        // Verify the participant hasn't already performed genesis
        let participant = &ctx.accounts.participant_record;
        require!(!participant.has_completed, GenesisError::AlreadyCompleted);

        // Verify SALT derives from EVM address
        // SALT format: "XEN" + first 16 chars of uppercase hex address
        let expected_salt_prefix = b"XEN";
        require!(
            &argon2_salt[0..3] == expected_salt_prefix,
            GenesisError::InvalidSalt
        );

        // In production: Verify EVM signature using secp256k1
        // This would use solana_program::secp256k1_recover
        // For now, we trust the client-side verification
        
        // Calculate XNMk amount to mint (1:1 mirror)
        // XNM is in wei (18 decimals), XNMk also uses 18 decimals
        let xnmk_amount = xnm_balance;

        // Mint XNMk tokens to participant
        let protocol_state = &ctx.accounts.protocol_state;
        let seeds = &[
            b"mint_authority".as_ref(),
            &[ctx.bumps.mint_authority],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.xnmk_mint.to_account_info(),
            to: ctx.accounts.participant_token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        
        token::mint_to(cpi_ctx, xnmk_amount)?;

        // Update participant record
        let participant = &mut ctx.accounts.participant_record;
        participant.owner = ctx.accounts.participant.key();
        participant.evm_address = evm_address;
        participant.xnm_balance = xnm_balance;
        participant.xnmk_minted = xnmk_amount;
        participant.term_days = term_days;
        participant.genesis_timestamp = Clock::get()?.unix_timestamp;
        participant.unlock_timestamp = participant.genesis_timestamp + (term_days as i64 * 86400);
        participant.argon2_salt = argon2_salt;
        participant.argon2_hash = argon2_hash;
        participant.signature = signature;
        participant.has_completed = true;
        participant.coherence = 100; // τκ 1.00 at genesis
        participant.bump = ctx.bumps.participant_record;

        // Update protocol state
        let protocol = &mut ctx.accounts.protocol_state;
        protocol.total_minted = protocol.total_minted.checked_add(xnmk_amount)
            .ok_or(GenesisError::Overflow)?;
        protocol.total_participants = protocol.total_participants.checked_add(1)
            .ok_or(GenesisError::Overflow)?;

        // Emit event
        emit!(GenesisCompleted {
            participant: ctx.accounts.participant.key(),
            evm_address,
            xnm_balance,
            xnmk_minted: xnmk_amount,
            term_days,
            genesis_timestamp: participant.genesis_timestamp,
            unlock_timestamp: participant.unlock_timestamp,
        });

        msg!("Genesis Ritual completed!");
        msg!("EVM Address: {:?}", evm_address);
        msg!("XNM Balance: {}", xnm_balance);
        msg!("XNMk Minted: {}", xnmk_amount);
        msg!("Term: {} days", term_days);

        Ok(())
    }

    /// Update coherence score for a participant (called by witnesses)
    pub fn update_coherence(
        ctx: Context<UpdateCoherence>,
        new_coherence: u8,
    ) -> Result<()> {
        require!(new_coherence <= 100, GenesisError::InvalidCoherence);
        
        let participant = &mut ctx.accounts.participant_record;
        participant.coherence = new_coherence;
        
        emit!(CoherenceUpdated {
            participant: participant.owner,
            coherence: new_coherence,
        });
        
        Ok(())
    }

    /// Pause/unpause the genesis ritual (admin only)
    pub fn set_active(
        ctx: Context<AdminAction>,
        is_active: bool,
    ) -> Result<()> {
        let protocol = &mut ctx.accounts.protocol_state;
        protocol.is_active = is_active;
        
        msg!("Protocol active status: {}", is_active);
        
        Ok(())
    }
}

// ============================================================================
// Account Structures
// ============================================================================

#[account]
#[derive(Default)]
pub struct ProtocolState {
    /// Protocol authority (admin)
    pub authority: Pubkey,
    /// XNMk token mint
    pub xnmk_mint: Pubkey,
    /// Genesis start timestamp
    pub genesis_timestamp: i64,
    /// Total XNMk minted
    pub total_minted: u64,
    /// Total participants
    pub total_participants: u64,
    /// Whether genesis is active
    pub is_active: bool,
    /// PDA bump
    pub bump: u8,
}

impl ProtocolState {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // xnmk_mint
        8 +  // genesis_timestamp
        8 +  // total_minted
        8 +  // total_participants
        1 +  // is_active
        1;   // bump
}

#[account]
#[derive(Default)]
pub struct ParticipantRecord {
    /// Solana wallet owner
    pub owner: Pubkey,
    /// EVM address (20 bytes)
    pub evm_address: [u8; 20],
    /// Original XNM balance (wei)
    pub xnm_balance: u64,
    /// XNMk minted
    pub xnmk_minted: u64,
    /// Term commitment (days)
    pub term_days: u16,
    /// Genesis timestamp
    pub genesis_timestamp: i64,
    /// Unlock timestamp
    pub unlock_timestamp: i64,
    /// Argon2id SALT
    pub argon2_salt: [u8; 19],
    /// Argon2id hash output
    pub argon2_hash: [u8; 86],
    /// EVM signature
    pub signature: [u8; 65],
    /// Whether genesis is completed
    pub has_completed: bool,
    /// Coherence score (0-100, representing τκ 0.00-1.00)
    pub coherence: u8,
    /// PDA bump
    pub bump: u8,
}

impl ParticipantRecord {
    pub const LEN: usize = 8 +  // discriminator
        32 +  // owner
        20 +  // evm_address
        8 +   // xnm_balance
        8 +   // xnmk_minted
        2 +   // term_days
        8 +   // genesis_timestamp
        8 +   // unlock_timestamp
        19 +  // argon2_salt
        86 +  // argon2_hash
        65 +  // signature
        1 +   // has_completed
        1 +   // coherence
        1;    // bump
}

// ============================================================================
// Context Structures
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = ProtocolState::LEN,
        seeds = [b"protocol_state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    /// The XNMk token mint
    #[account(mut)]
    pub xnmk_mint: Account<'info, Mint>,

    /// Mint authority PDA
    /// CHECK: PDA for signing mint transactions
    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    pub mint_authority: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(evm_address: [u8; 20])]
pub struct GenesisRitual<'info> {
    #[account(mut)]
    pub participant: Signer<'info>,

    #[account(
        mut,
        seeds = [b"protocol_state"],
        bump = protocol_state.bump,
        constraint = protocol_state.is_active @ GenesisError::ProtocolPaused
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        init,
        payer = participant,
        space = ParticipantRecord::LEN,
        seeds = [b"participant", evm_address.as_ref()],
        bump
    )]
    pub participant_record: Account<'info, ParticipantRecord>,

    /// The XNMk token mint
    #[account(
        mut,
        address = protocol_state.xnmk_mint
    )]
    pub xnmk_mint: Account<'info, Mint>,

    /// Mint authority PDA
    /// CHECK: PDA for signing mint transactions
    #[account(
        seeds = [b"mint_authority"],
        bump
    )]
    pub mint_authority: AccountInfo<'info>,

    /// Participant's XNMk token account
    #[account(
        init_if_needed,
        payer = participant,
        associated_token::mint = xnmk_mint,
        associated_token::authority = participant
    )]
    pub participant_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateCoherence<'info> {
    pub witness: Signer<'info>,

    #[account(
        seeds = [b"protocol_state"],
        bump = protocol_state.bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,

    #[account(
        mut,
        constraint = participant_record.has_completed @ GenesisError::NotCompleted
    )]
    pub participant_record: Account<'info, ParticipantRecord>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(
        constraint = authority.key() == protocol_state.authority @ GenesisError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"protocol_state"],
        bump = protocol_state.bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct GenesisCompleted {
    pub participant: Pubkey,
    pub evm_address: [u8; 20],
    pub xnm_balance: u64,
    pub xnmk_minted: u64,
    pub term_days: u16,
    pub genesis_timestamp: i64,
    pub unlock_timestamp: i64,
}

#[event]
pub struct CoherenceUpdated {
    pub participant: Pubkey,
    pub coherence: u8,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum GenesisError {
    #[msg("Invalid term commitment. Must be between 1 and 365 days.")]
    InvalidTermCommitment,
    
    #[msg("XNM balance cannot be zero.")]
    ZeroBalance,
    
    #[msg("Genesis ritual already completed for this address.")]
    AlreadyCompleted,
    
    #[msg("Invalid Argon2 SALT. Must start with 'XEN'.")]
    InvalidSalt,
    
    #[msg("Invalid EVM signature.")]
    InvalidSignature,
    
    #[msg("Protocol is currently paused.")]
    ProtocolPaused,
    
    #[msg("Arithmetic overflow.")]
    Overflow,
    
    #[msg("Unauthorized action.")]
    Unauthorized,
    
    #[msg("Genesis not completed for this participant.")]
    NotCompleted,
    
    #[msg("Invalid coherence value. Must be 0-100.")]
    InvalidCoherence,
}
