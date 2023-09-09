import { TaskLayoutContainer } from './tasks/TaskLayoutContainer';
import { Task1 } from './tasks/Task1';
import { Task2 } from './tasks/Task2';
import { Task3 } from './tasks/Task3';
import { Task4 } from './tasks/Task4';
import { Task5 } from './tasks/Task5';


const App = (): JSX.Element => {
    return (
       <>
           <div className="container w-full min-h-screen grid grid-cols-4 gap-x-[15px] p-[20px] max-lg:grid-cols-2">
               <TaskLayoutContainer>
                   <Task1/>
               </TaskLayoutContainer>

               <TaskLayoutContainer>
                   <Task2/>
               </TaskLayoutContainer>

               <TaskLayoutContainer>
                   <Task3/>
               </TaskLayoutContainer>

               <TaskLayoutContainer>
                   <Task4/>
               </TaskLayoutContainer>
           </div>

           <div className="container p-[20px] w-1/2 flex">
               <TaskLayoutContainer>
                   <Task5/>
               </TaskLayoutContainer>
           </div>
       </>

    );
};
export default App;
