import { ChangeEvent, useState } from 'react';

type GeneratorType = () => number;

const getGenerator = (PA: number, PBA: number): [GeneratorType, number[]] => {
    const P_NOTA = 1 - PA;

    const PNOTA_B = 1 - PBA; // 3

    const P_AB = PA * PBA; // P(AB)
    const PA_NOTB = PA - P_AB; // 2
    const P_NOTA_NOTB = P_NOTA - PA_NOTB; // P(!A!B)

    const steps = [P_AB, PA_NOTB, PNOTA_B, P_NOTA_NOTB];

    return [() => {
        const random = Math.random();

        let sum = 0;

        for (let index = 0; index < steps.length; ++index) {
            if (random >= sum && random < sum + steps[index]) {
                return index;
            }
            sum += steps[index];
        }

        return steps.length;
    }, steps]
};

const EVENTS_COUNT = 1_000_000;

export const Task3 = (): JSX.Element => {
    const [probabilities, setProbabilities] = useState<string>('');
    const [generator, setGenerator] = useState<[GeneratorType, number[]] | null>(null);
    const [generatedValues, setGeneratedValues] = useState<string>('');

    const onProbabilityInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setProbabilities(event.currentTarget.value);
    };

    const onGenerateGeneratorClick = (): void => {
        const values = probabilities.split(' ');
        const nums = values.map(Number);

        if (nums.every(num => !Number.isNaN(num) && num >= 0 && num <= 1) && nums.length === 2) {
            setGeneratedValues('');
            const [generator, steps] = getGenerator(nums[0], nums[1]);
            setGenerator([generator, steps]);
        } else {
            window.alert('Невалидные значения');
        }
    };

    const onGenerateValueClick = (): void => {
        if (!generator) {
            return;
        }

        const map = new Map<number, number>([[0, 0], [1, 0], [2, 0], [3, 0]]);

        for (let counter = 0; counter < EVENTS_COUNT; ++counter) {
            const generated = generator[0]();

            map.set(generated, (map.get(generated) || 0) + 1);
        }

        setGeneratedValues(`
expected: 
    ${generator[1].map(item => item.toFixed(4)).join(' | ')} 
    
real: 
${Array.from(map.entries()).map(([key, item]) => '\t' + key + ' : ' + (item / EVENTS_COUNT).toFixed(5) + '\n')}`);
    };

    return (
        <div className="flex flex-col w-full h-full gap-y-[10px]  pt-2 px-1">
            <h2>Имитация сложного события, состоящего из зависимых событий</h2>
            <form className="flex flex-col gap-y-1">
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    onChange={onProbabilityInputChange}
                    value={probabilities}
                />

                <button
                    type="button"
                    onClick={onGenerateGeneratorClick}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Сформировать генератор
                </button>
            </form>

            <hr/>

            <button
                type="button"
                className="py-2.5 px-1 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={onGenerateValueClick}
            >
                Сгенерировать 10^6 значений и частоты
            </button>

            <textarea
                disabled
                className="flex grow-1 w-full h-full"
                value={generatedValues}
            />
        </div>
    );
};

