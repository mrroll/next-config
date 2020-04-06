// Env
require("dotenv").config();

// Helper Functions
module.exports = function getConfig() {
  const envs = Object.entries(process.env).reduce(
    (allVariables, currentVariable) => {
      const [key, value] = currentVariable;
      if (!key.startsWith("NEXTJS_")) {
        return allVariables;
      }
      const newVariable = key.replace("NEXTJS_", "");
      return { ...allVariables, ...{ [newVariable]: value } };
    },
    {}
  );
  return envs;
};
