import { useEffect, useRef, useState } from 'react';
import { RandomGenerator } from './random';

interface Donation {
    title: string;
    amount: number;
    id: string;
}

type GeneratorType = () => number;
const getGenerator = (probabilitiesGroup: number[]): GeneratorType => {
    const gen = new RandomGenerator(41222);
    return (): number => {
        const random = gen.random();
        let sum = 0;

        for (let index = 0; index < probabilitiesGroup.length; ++index) {
            if (random >= sum && random < sum + probabilitiesGroup[index]) {
                return index;
            }
            sum += probabilitiesGroup[index];
        }

        return probabilitiesGroup.length;
    };
};

export const Task5 = (): JSX.Element => {
    const gameInput = useRef<HTMLInputElement>(null);
    const amountInput = useRef<HTMLInputElement>(null);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [sum, setSum] = useState<number>(0);

    const onAdd = () => {
        if (gameInput.current?.value === '' || Number.isNaN(Number(amountInput.current?.value))) {
            return;
        }

        const newItem: Donation = {
            title: gameInput.current?.value || '',
            amount: Number(amountInput.current?.value),
            id: `${new Date().getTime()}${Math.random() * 1_000_000}`
        };
        const index = donations.findIndex(i => i.title === newItem.title);
        if (index === -1) {
            setDonations(previous => [...previous, newItem]);
        } else {
            const item = {...donations[index]};
            item.amount += Number(amountInput.current?.value);
            const arr = [...donations.slice(0, index), item, ...donations.slice(index + 1)];
            setDonations(() => arr);
        }
    };

    const onRemoveAll = () => setDonations(() => []);

    const spin = () => {
        const expected = donations.map(d => d.amount / sum);
        const generator = getGenerator(donations.map(d => d.amount / sum));
        const arr = new Array(expected.length).fill(0);
        for (let counter = 0; counter < 100000; ++counter) {
            ++arr[generator()];
        }

        for (let counter = 0; counter < arr.length; ++counter) {
            arr[counter] /= 100000;
        }
        window.alert(JSON.stringify(expected) + '\n' + JSON.stringify(arr));
    };

    useEffect(() => {
        setSum(() => donations.reduce((res, curr) => res + curr.amount, 0));
    }, [donations])

    return (
        <div className="flex flex-col w-full h-full gap-y-[10px] pt-2 px-1">
            <h2>Колесо фортуны</h2>
            <form className="flex flex-col gap-y-1">
                <div className="flex flex-row gap-x-[15px]">
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        placeholder="Название игры"
                        ref={gameInput}
                    />

                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="number"
                        placeholder="Сумма зрительского пожертвования"
                        ref={amountInput}
                    />
                </div>

                <div className="w-full flex flex-row gap-x-1 justify-between">
                    <button
                        type="button"
                        className="transition-all text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={onAdd}
                    >
                        Добавить
                    </button>
                    <button
                        type="button"
                        className="transition-all text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={onRemoveAll}
                    >
                        Удалить все
                    </button>

                    <button
                        type="button"
                        className="transition-all text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={spin}
                    >
                        Крутить
                    </button>
                </div>
            </form>

            <hr/>
            <hr/>

            <div className="flex flex-wrap flex-row gap-1">
                {
                    donations.map(donation => (
                        <section key={donation.id} className="flex w-fit flex-row p-2 gap-x-2 border border-gray-300">
                            <h3>{donation.title}</h3>
                            <p>{donation.amount}</p>
                        </section>
                    ))
                }
            </div>


        </div>
    );
};
