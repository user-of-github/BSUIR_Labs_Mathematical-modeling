import React from 'react';

export const Task = ({children}: React.PropsWithChildren<object>): JSX.Element => {
    return (
      <section className="flex flex-col justify-start border-fuchsia-200 border p-1">
          {children}
      </section>
    );
};
