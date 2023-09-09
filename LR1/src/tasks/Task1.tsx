import { ChangeEvent, useState } from 'react';


type GeneratorType = () => boolean;

const getGenerator = (probability: number): GeneratorType => {
    return (): boolean => {
        const random = Math.random();
        return random <= probability;
    };
};

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
        if (generator) {
            setGeneratedValues(values => values + '\n' + String(generator()));
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-y-[10px]">
            <h2>Иммитация случайного события</h2>
            <form className="flex flex-col gap-y-1">
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    onChange={onProbabilityInputChange}
                    value={probability}
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
                className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={onGenerateValueClick}
            >
                Генерировать значение
            </button>

            <textarea
                disabled
                className="flex grow-1 w-full h-full"
                value={generatedValues}
            />
        </div>
    );
};

