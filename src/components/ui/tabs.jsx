import React from 'react';

const TabsContext = React.createContext();

const Tabs = ({ value, onValueChange, className = '', children, ...props }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-gray-400 ${className}`}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef(({ className = '', value, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;
  
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
        isSelected 
          ? 'bg-gray-900 text-white shadow-sm' 
          : 'hover:bg-gray-700 text-gray-300'
      } ${className}`}
      onClick={() => onValueChange?.(value)}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef(({ className = '', value, children, ...props }, ref) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  
  if (selectedValue !== value) return null;
  
  return (
    <div
      ref={ref}
      className={`mt-2 focus-visible:outline-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };