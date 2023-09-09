import { Task } from './tasks/TaskLayoutContainer';
import { Task1 } from './tasks/Task1';
import { Task2 } from './tasks/Task2';
import { Task4 } from './tasks/Task4';


const App = (): JSX.Element => {
    return (
        <div className="w-full min-h-screen grid grid-cols-5 gap-x-[15px] p-[20px] max-lg:grid-cols-2">
            <Task>
                <Task1/>
            </Task>

            <Task>
                <Task2/>
            </Task>

            <Task></Task>

            <Task>
                <Task4/>
            </Task>
        </div>
    );
};
export default App;
