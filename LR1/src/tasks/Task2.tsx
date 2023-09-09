import { ChangeEvent, useState } from 'react';


const EVENTS_COUNT = 1_000_000;

type GeneratorType = () => boolean[];
const getGenerator = (probabilities: number[]): GeneratorType => {
    return (): boolean[] => {
        return new Array(probabilities.length)
            .fill(null)
            .map(() => Math.random())
            .map((event, index): boolean => {
                return event <= probabilities[index];
            });
    };
};


export const Task2 = (): JSX.Element => {
    const [probabilities, setProbabilities] = useState<string>('');
    const [generator, setGenerator] = useState<GeneratorType | null>(null);
    const [generatedValues, setGeneratedValues] = useState<string>('');

    const onProbabilitiesInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setProbabilities(event.currentTarget.value);
    };

    const onGenerateGeneratorClick = (): void => {
        const values = probabilities.split(' ');
        const nums = values.map(Number);

        if (!nums.every(num => !Number.isNaN(num) && num >= 0 && num <= 1)) {
            window.alert('Невалидные значения');
        } else {
            setGeneratedValues('');
            setGenerator(() => getGenerator(nums));
        }
    };

    const onGenerateValueClick = (): void => {
        if (!generator) {
            return;
        }

        const length = generator().length;
        const falsesCounts = new Array(length).fill(0);
        const truesCounts = new Array(length).fill(0);

        for (let counter = 0; counter < EVENTS_COUNT; ++counter) {
            const generated = generator();
            for (let index = 0; index < length; ++index) {
                if (!generated[index]) {
                    ++falsesCounts[index];
                } else {
                    ++truesCounts[index];
                }
            }
        }

        let response = '';
        for (let index = 0; index < length; ++index) {
            response += `{ true: ${(truesCounts[index] / EVENTS_COUNT).toFixed(4)} ==> false: ${(falsesCounts[index] / EVENTS_COUNT).toFixed(4)} }, \n`
        }

        setGeneratedValues(response);
    };

    return (
        <div className="flex flex-col w-full h-full gap-y-[10px]  pt-2 px-1">
            <h2 className="min-h-[48px]">Имитация сложного события</h2>
            <form className="flex flex-col gap-y-1">
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    onChange={onProbabilitiesInputChange}
                    value={probabilities}
                    placeholder="Ввведите массив вероятностей"
                />

                <button
                    type="button"
                    onClick={onGenerateGeneratorClick}
                    className="transition-all text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-1 py-1 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Сформировать генератор
                </button>
            </form>

            <hr/>

            <button
                type="button"
                className="transition-all py-2.5 px-1 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
