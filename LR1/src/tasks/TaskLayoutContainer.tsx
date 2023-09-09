import React from 'react';

export const TaskLayoutContainer = ({children}: React.PropsWithChildren<object>): JSX.Element => {
    return (
      <section className="flex w-full flex-col justify-start border-fuchsia-200 border p-1 max-h-screen">
          {children}
      </section>
    );
};
