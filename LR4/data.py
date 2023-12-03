queue_length: int = 4  # фиксированная длина очереди m
intensity_of_receipt_of_applications_per_hour: int = 4  # интенсивность поступления заявок, λ
t_of_service: float = 0.52   # время обслуживания 1 заявки (в часах)
intensity_of_service_of_applications_per_hour: float = 1 / t_of_service  # μ, интенсивность обслуживания заявок

time_designation: str = 'час.'
