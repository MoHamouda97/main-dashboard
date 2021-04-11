let hostname = window.location.hostname;

export const environment = {
  production: true,
  endPoint: `http://${hostname}:62217/api/`,
  downloadRepPath: `http://${hostname}:62217/api/`  
};
