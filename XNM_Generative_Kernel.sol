// XNM_Generative_Kernel.sol (Anchor/Rust — XPL-compliant from day zero)

#[program]
pub mod xnm_kernel {
    use super::*;

    pub fn genesis_ritual(ctx: Context<GenesisRitual>, term: u64, difficulty: u8) -> Result<()> {
        let miner = &mut ctx.accounts.miner;
        let kernel_state = &mut ctx.accounts.kernel_state;

        // Proof-of-Participation + Temporal Commitment
        require!(term >= MIN_TERM, ErrorCode::TermTooShort);
        let rank = calculate_rank(term);
        let reward = calculate_xnm_reward(rank, difficulty, kernel_state.global_amplifier)?;

        miner.xnm_balance += reward;
        kernel_state.total_xnm_minted += reward;
        kernel_state.global_amplifier = update_amplifier(kernel_state.participants)?;

        emit!(XNMGenesisEvent {
            miner: miner.key(),
            term,
            reward,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}
