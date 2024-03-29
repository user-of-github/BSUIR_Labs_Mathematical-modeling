from queueing_system import QueueingSystem
from data import queue_length, intensity_of_service_of_applications_per_hour, intensity_of_receipt_of_applications_per_hour


def main() -> None:
    virtual_simulation_time: float = 10
    print(f'Одноканальная СМО, размер очереди: {queue_length}')

    queueing_system: QueueingSystem = QueueingSystem(
        queue_length,
        intensity_of_receipt_of_applications_per_hour,
        intensity_of_service_of_applications_per_hour
    )

    queueing_system.run_simulation(virtual_simulation_time)

    print('----------------------- FINISH -----------------------------')
    queueing_system.print_statistics()


if __name__ == '__main__':
    main()
