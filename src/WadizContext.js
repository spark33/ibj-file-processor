import React, { useContext } from 'react';

export const WadizContext = React.createContext({})
export const useWadizContext = () => useContext(WadizContext)

export const WadizContextProvider = ({ children }) => {
    const [activeTab, setActiveTab] = React.useState(0);
    return (
        <WadizContext.Provider
            value={{
                activeTab,
                setActiveTab
            }}
        >
            {children}
        </WadizContext.Provider>
    )
}