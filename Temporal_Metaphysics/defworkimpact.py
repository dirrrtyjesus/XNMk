def calculate_impact(work_type, output):  
    impact_matrix = {  
        "creative": 3.2 * originality_score,  
        "technical": 1.7 * efficiency_gain,  
        "social": 4.1 * lives_impacted  
    }  
    return impact_matrix[work_type] * complexity_factor  