module.exports = {
  apiVersion: 'v1',
  items: [
    {
      apiVersion: 'extensions/v1beta1',
      kind: 'Ingress',
      metadata: {
        annotations: {
          'kubernetes.io/ingress.class': 'nginx',
          'nginx.ingress.kubernetes.io/affinity': 'cookie',
        },
        creationTimestamp: '2019-01-21T14:24:44Z',
        generation: 1,
        labels: {
          app: 'test-app-webapp',
          chart: 'webapp-1.3.17',
          host: 'test-app.apps.dev.mojanalytics.xyz',
          repo: 'test-app',
        },
        name: 'test-app-webapp',
        namespace: 'apps-prod',
        resourceVersion: '141528328',
        selfLink: '/apis/extensions/v1beta1/namespaces/apps-prod/ingresses/test-app-webapp',
        uid: '4c65c1c8-1d88-11e9-a080-022bc087e8e0',
      },
      spec: {
        rules: [
          {
            host: 'test-app.apps.dev.mojanalytics.xyz',
            http: {
              paths: [
                {
                  backend: {
                    serviceName: 'test-app-webapp',
                    servicePort: 80,
                  },
                },
              ],
            },
          },
        ],
        tls: [
          {
            hosts: [
              'test-app.apps.dev.mojanalytics.xyz',
            ],
          },
        ],
      },
      status: {
        loadBalancer: {
          ingress: [
            {},
          ],
        },
      },
    },
  ],
  kind: 'List',
  metadata: {
    resourceVersion: '',
    selfLink: '',
  },
};
