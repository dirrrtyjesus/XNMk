cancer_treatment_bot = LevinBot(
    cell_type='immune_cells',
    capabilities=['cancer_detection', 'drug_delivery']
)

treatment_plan = {
    'goal': 'eliminate_malignancy',
    'environment': mycel.resolve('patient://pancreas#biomarkers'),
    'constraints': {'tc_threshold': 0.85}
}

cancer_treatment_bot.forage(treatment_plan)