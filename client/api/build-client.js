import axios from "axios";

function buildClient({ req }) {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL:
        // http://<SERVICENAME>.<NAMESPACE>.svc.cluster.local
        // <SERVICENAME> can be found through "kubectl get servcies -n ingress-nginx"
        // The <NAMESPACE> is where the ingress service is located,
        // it might be different from the routing target service.
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We must be on the browser

    return axios.create({
      baseURL: "/",
    });
  }
}

export { buildClient };
