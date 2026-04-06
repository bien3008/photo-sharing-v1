import React from "react";

export const AppContext = React.createContext({
  advancedEnabled: false,
  setAdvancedEnabled: () => {},
});
