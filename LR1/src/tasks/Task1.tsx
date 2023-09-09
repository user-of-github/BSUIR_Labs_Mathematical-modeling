import { ChangeEvent, useState } from 'react';


type GeneratorType = () => boolean;

const getGenerator = (probability: number): GeneratorType => {
    return (): boolean => {
        const random = Math.random();
        return random <= probability;
    };
};

const EVENTS_COUNT = 1_000_000;

export const Task1 = (): JSX.Element => {
    const [probability, setProbability] = useState<string>('');
    const [generator, setGenerator] = useState<GeneratorType | null>(null);
    const [generatedValues, setGeneratedValues] = useState<string>('');

    const onProbabilityInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setProbability(event.currentTarget.value);
    };

    const onGenerateGeneratorClick = (): void => {
        const tryParse = Number(probability);

        if (!Number.isNaN(tryParse) && (tryParse >= 0 && tryParse <= 1)) {
            setGenerator(() => getGenerator(tryParse));
            setGeneratedValues('');
        } else {
            window.alert('Невалидное значение');
        }
    };

    const onGenerateValueClick = (): void => {
        if (!generator) {
            return;
        }
        setGeneratedValues('');

        let falsesCount = 0;
        let truesCount = 0;


        for (let counter = 0; counter < EVENTS_COUNT; ++counter) {
            const value = generator();
            if (value) {
                ++truesCount;
            } else {
                ++falsesCount;
            }
        }

        setGeneratedValues(`
        {
            true: ${truesCount / EVENTS_COUNT},
            false: ${falsesCount / EVENTS_COUNT}
        }`);
    };

    return (
        <div className="flex flex-col w-full h-full gap-y-[10px]  pt-2 px-1">
            <h2 className="min-h-[48px]">Имитация случайного события</h2>
            <form className="flex flex-col gap-y-1">
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    onChange={onProbabilityInputChange}
                    value={probability}
                    placeholder="Ввведите число - вероятность"
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

