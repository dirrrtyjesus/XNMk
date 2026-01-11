// WorkQuantumMinter.sol  
function mintXQ(  
  uint impact,  
  uint tau_k,  
  uint vibes_index,  
  bytes calldata zkProof  
) public {  
  require(SIVRegistry[msg.sender], "Unverified SIV");  
  require(tau_k >= 70, "Insufficient coherence"); // 7.0 = 70  
  require(zkProofValid(zkProof), "Invalid attestation");  
  
  uint xq_amount = impact * tau_k * exp(vibes_index/100);  
  _mint(msg.sender, xq_amount);  
  emit ValueComposed(tau_k, xq_amount);  
}  