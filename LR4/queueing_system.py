import time
import numpy as np
from math import log
from statistics import  mean


TIME_INTERVAL: float = 0.01


class QueueingSystem:
    def __init__(self, m: int, lambda_: float, mu: float, n=1, p=1):
        self.number_of_channels = n
        self.queue_size = m
        self.request_intensity = lambda_
        self.service_intensity = mu
        self.main_channel_status = None
        self.probability_to_serve_the_request = p
        self.request_number = 0
        self.queue = list()
        self.current_time = 0.00

        self.done_requests = list()
        self.done_requests_ids = list()
        self.rejected_requests = list()

        self.channels_and_queue_state = []
        self.channels_state = []
        self.queue_state = []

    def run_simulation(self, run_life_time: float):
        self.create_new_request()
        time_for_new_request = self.request_time_generator() + self.current_time

        # Пока время работы СМО не закончилось
        while self.current_time <= run_life_time:
            self.current_time += TIME_INTERVAL
            time.sleep(TIME_INTERVAL)
            self.process_queue()
            self.process_channels()

            self.get_statistic()

            if time_for_new_request <= self.current_time:
                self.create_new_request()
                time_for_new_request = self.request_time_generator() + self.current_time

    def create_new_request(self):
        """ Создаст новую заявку, если есть места в очереди. Иначе заявка будет отклонена """
        self.request_number += 1
        print(f'🔔 NEW REQUEST {self.request_number}')

        request_id: int = self.request_number
        # Если количество мест очереди не превышает данное число, то ✅
        if len(self.queue) < self.queue_size:
            # Запрос отправлен на обработку
            self.queue.append((request_id, self.current_time))
        else:
            # Запрос отклонен
            self.rejected_requests.append(request_id)
            print(f'❌ Request {request_id} denied. Current queue: {self.queue}')

    def process_queue(self):
        """ Выполняет одну итерацию по очереди """
        is_channel_free: bool = self.main_channel_status is None

        # Если очередь пуста выходим из функции
        if len(self.queue) == 0:
            return

        # Если нет свободных каналов, выходим из функции
        if is_channel_free is False:
            return

        request_id, start_time = self.queue.pop(0)
        time_in_queue = self.current_time - start_time
        self.serve_request(request_id, start_time, time_in_queue)

    def process_channels(self):
        """ Принимает заявку при наличии времени """
        if self.main_channel_status is None:
            return

        #print(main_channel_status, current_time)
        if self.main_channel_status[4] <= self.current_time:
            self.accept_request(self.main_channel_status)

    def serve_request(self, request_id, start_time, time_in_queue):
        """ Добавляет заявку на место пустого канала """
        serve_time: float = self.serve_time_generator()
        end_time: float = serve_time + self.current_time
        self.main_channel_status = (request_id, start_time, time_in_queue, serve_time, end_time)

    def accept_request(self, request):
        self.main_channel_status = None  # канал свободен
        time_in_queuing_system = self.current_time - request[1]
        self.done_requests.append((request[0], request[2], request[3], time_in_queuing_system))
        print(f'✅ Request {request[0]} completed')

    def get_statistic(self):
        n = 1
        # Количество каналов - количество пустых каналов + длина очереди
        temp = 1 if self.main_channel_status == 1 else 0
        self.channels_and_queue_state.append(n - temp + len(self.queue))
        # Количество каналов - количество пустых каналов
        self.channels_state.append(n - temp)
        # Длина очереди
        self.queue_state.append(len(self.queue))

    def get_final_probabilities(self):
        final_probabilities: list = list()

        n: int = 1
        m: int = self.queue_size

        n_: int = len(self.channels_and_queue_state)

        for i in range(n + m + 1):
            p = self.channels_and_queue_state.count(i) / n_
            final_probabilities.append(p)

        return final_probabilities

    def get_average_service_request_time(self):
        """ Возвращает среднее время затраченное на обработку заявки """
        average_service_request_time: list = list()

        for i in range(len(self.done_requests)):
            average_service_request_time.append(self.done_requests[i][2])

        return mean(average_service_request_time)

    def get_average_queue_time(self):
        """ Возвращает среднее время, которое заявка была в очереди """
        average_queue_time = []

        for i in range(len(self.done_requests)):
            average_queue_time.append(self.done_requests[i][1])

        return mean(average_queue_time)

    def get_average_request_time_in_system(self):
        """ Возвращает среднее время заявки в системе """
        average_request_time_in_system = []

        for i in range(len(self.done_requests)):
            average_request_time_in_system.append(self.done_requests[i][3])

        return mean(average_request_time_in_system)

    def show_statistic(self):
        """ Отображает полученные данные за время работы системы массового обслуживания """
        final_probabilities = self.get_final_probabilities()
        probability_of_idle_channels = final_probabilities[0]
        denial_of_service_probability = final_probabilities[-1]
        # Относительная пропускная способность - среднее число обслуженных заявок / среднее число поступивших заявок
        # за одно и тоже время
        relative_bandwidth = 1 - denial_of_service_probability
        # Абсолютная пропускная способность - среднее число заявок, которео может обслужить СМО за единицу времени
        absolute_bandwidth = self.request_intensity * relative_bandwidth
        average_channel_usage = mean(self.channels_state)
        average_number_of_request_in_queue = mean(self.queue_state)
        average_number_of_request_in_system = mean(self.channels_and_queue_state)
        average_service_request_time = self.get_average_service_request_time()
        average_queue_time = self.get_average_queue_time()
        average_request_time_in_system = self.get_average_request_time_in_system()
        print('Одноканальная СМО')
        print(f'Характеристики для очереди размером: {self.queue_size}')
        print(f'Финальные вероятности: {final_probabilities}')
        print(f'Вероятность простоя каналов: {probability_of_idle_channels}')
        print(f'Вероятность отказа обсуживания: {denial_of_service_probability} ')
        print(f'Относительная пропускная способность: {relative_bandwidth}')
        print(f'Абсолютная пропускная способность: {absolute_bandwidth}')
        print(f'Среднее число занятых каналов: {average_channel_usage}')
        print(f'Среднее число заявок в очереди: {average_number_of_request_in_queue}')
        print(f'Среднее число заявок в системе: {average_number_of_request_in_system}')
        print(f'Среднее время заявки под обслуживанием: {average_service_request_time}')
        print(f'Среднее время заявки в очереди: {average_queue_time}')
        print(f'Среднее время заявки в системе: {average_request_time_in_system}')
        print()

    def request_time_generator(self):
        """ Возвращает время, затраченное на ожидание заявки в очереди """
        return exponential_value_generator(self.request_intensity)

    def serve_time_generator(self):
        """ Возвращает время, затраченное на исполнение заявки """
        return exponential_value_generator(self.service_intensity)


def exponential_value_generator(intensity):
    return - 1 / intensity * log(1 - np.random.uniform())
