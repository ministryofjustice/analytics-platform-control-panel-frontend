module.exports = {
  apiVersion: 'v1',
  items: [
    {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        annotations: {
          'iam.amazonaws.com/role': 'alpha_user_andyhd',
          'kubernetes.io/created-by': '{"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"user-andyhd","name":"andyhd-rstudio-rstudio-4159917267","uid":"d081709c-b589-11e7-a28d-06efce866f16","apiVersion":"extensions","resourceVersion":"45480082"}}\n',
        },
        creationTimestamp: '2017-12-02T17:41:40Z',
        generateName: 'andyhd-rstudio-rstudio-4159917267-',
        labels: {
          app: 'rstudio',
          'pod-template-hash': '4159917267',
        },
        name: 'andyhd-rstudio-rstudio-4159917267-vlb52',
        namespace: 'user-andyhd',
        ownerReferences: [
          {
            apiVersion: 'extensions/v1beta1',
            blockOwnerDeletion: true,
            controller: true,
            kind: 'ReplicaSet',
            name: 'andyhd-rstudio-rstudio-4159917267',
            uid: 'd081709c-b589-11e7-a28d-06efce866f16',
          },
        ],
        resourceVersion: '45724902',
        selfLink: '/api/v1/namespaces/user-andyhd/pods/andyhd-rstudio-rstudio-4159917267-vlb52',
        uid: '0e0bb930-d788-11e7-8b5e-0203ba1d24e6',
      },
      spec: {
        containers: [
          {
            env: [
              {
                name: 'USER',
                value: 'andyhd',
              },
              {
                name: 'AUTH0_CLIENT_SECRET',
                valueFrom: {
                  secretKeyRef: {
                    key: 'client_secret',
                    name: 'andyhd-rstudio-rstudio',
                  },
                },
              },
              {
                name: 'AUTH0_CLIENT_ID',
                valueFrom: {
                  secretKeyRef: {
                    key: 'client_id',
                    name: 'andyhd-rstudio-rstudio',
                  },
                },
              },
              {
                name: 'AUTH0_DOMAIN',
                valueFrom: {
                  secretKeyRef: {
                    key: 'domain',
                    name: 'andyhd-rstudio-rstudio',
                  },
                },
              },
              {
                name: 'AUTH0_CALLBACK_URL',
                valueFrom: {
                  secretKeyRef: {
                    key: 'callback_url',
                    name: 'andyhd-rstudio-rstudio',
                  },
                },
              },
              {
                name: 'COOKIE_SECRET',
                valueFrom: {
                  secretKeyRef: {
                    key: 'cookie_secret',
                    name: 'andyhd-rstudio-rstudio',
                  },
                },
              },
              {
                name: 'SECURE_COOKIE_KEY',
                valueFrom: {
                  secretKeyRef: {
                    key: 'secure_cookie_key',
                    name: 'andyhd-rstudio-rstudio',
                  },
                },
              },
              {
                name: 'PROXY_TARGET_HOST',
                value: 'localhost',
              },
              {
                name: 'PROXY_TARGET_PORT',
                value: '8787',
              },
              {
                name: 'EXPRESS_HOST',
                value: '0.0.0.0',
              },
              {
                name: 'EXPRESS_PORT',
                value: '3000',
              },
            ],
            image: 'quay.io/mojanalytics/rstudio-auth-proxy:v1.2.0',
            imagePullPolicy: 'Always',
            name: 'rstudio-auth-proxy',
            ports: [
              {
                containerPort: 3000,
                name: 'http',
                protocol: 'TCP',
              },
            ],
            readinessProbe: {
              failureThreshold: 3,
              httpGet: {
                path: '/login?healthz',
                port: 'http',
                scheme: 'HTTP',
              },
              initialDelaySeconds: 5,
              periodSeconds: 5,
              successThreshold: 1,
              timeoutSeconds: 1,
            },
            resources: {
              limits: {
                cpu: '100m',
                memory: '128Mi',
              },
              requests: {
                cpu: '25m',
                memory: '64Mi',
              },
            },
            terminationMessagePath: '/dev/termination-log',
            terminationMessagePolicy: 'File',
            volumeMounts: [
              {
                mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
                name: 'default-token-vjhqm',
                readOnly: true,
              },
            ],
          },
          {
            env: [
              {
                name: 'USER',
                value: 'andyhd',
              },
              {
                name: 'AWS_DEFAULT_REGION',
                valueFrom: {
                  secretKeyRef: {
                    key: 'aws_default_region',
                    name: 'andyhd-rstudio-rstudio',
                  },
                },
              },
              {
                name: 'SECURE_COOKIE_KEY',
                valueFrom: {
                  secretKeyRef: {
                    key: 'secure_cookie_key',
                    name: 'andyhd-rstudio-rstudio',
                  },
                },
              },
              {
                name: 'TOOLS_DOMAIN',
                value: 'tools.alpha.mojanalytics.xyz',
              },
            ],
            image: 'quay.io/mojanalytics/rstudio:v1.3.1',
            imagePullPolicy: 'Always',
            name: 'r-studio-server',
            ports: [
              {
                containerPort: 8787,
                name: 'http',
                protocol: 'TCP',
              },
            ],
            readinessProbe: {
              failureThreshold: 3,
              httpGet: {
                path: '/',
                port: 'http',
                scheme: 'HTTP',
              },
              initialDelaySeconds: 5,
              periodSeconds: 5,
              successThreshold: 1,
              timeoutSeconds: 1,
            },
            resources: {
              limits: {
                cpu: '1500m',
                memory: '12Gi',
              },
              requests: {
                cpu: '200m',
                memory: '1Gi',
              },
            },
            terminationMessagePath: '/dev/termination-log',
            terminationMessagePolicy: 'File',
            volumeMounts: [
              {
                mountPath: '/home/andyhd',
                name: 'home',
              },
              {
                mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
                name: 'default-token-vjhqm',
                readOnly: true,
              },
            ],
          },
        ],
        dnsPolicy: 'ClusterFirst',
        nodeName: 'ip-192-168-14-177.eu-west-1.compute.internal',
        restartPolicy: 'Always',
        schedulerName: 'default-scheduler',
        securityContext: {},
        serviceAccount: 'default',
        serviceAccountName: 'default',
        terminationGracePeriodSeconds: 30,
        tolerations: [
          {
            effect: 'NoExecute',
            key: 'node.alpha.kubernetes.io/notReady',
            operator: 'Exists',
            tolerationSeconds: 300,
          },
          {
            effect: 'NoExecute',
            key: 'node.alpha.kubernetes.io/unreachable',
            operator: 'Exists',
            tolerationSeconds: 300,
          },
        ],
        volumes: [
          {
            name: 'home',
            persistentVolumeClaim: {
              claimName: 'nfs-home',
            },
          },
          {
            name: 'default-token-vjhqm',
            secret: {
              defaultMode: 420,
              secretName: 'default-token-vjhqm',
            },
          },
        ],
      },
      status: {
        conditions: [
          {
            lastProbeTime: null,
            lastTransitionTime: '2017-12-02T17:41:41Z',
            status: 'True',
            type: 'Initialized',
          },
          {
            lastProbeTime: null,
            lastTransitionTime: '2017-12-02T17:45:42Z',
            status: 'True',
            type: 'Ready',
          },
          {
            lastProbeTime: null,
            lastTransitionTime: '2017-12-02T17:41:40Z',
            status: 'True',
            type: 'PodScheduled',
          },
        ],
        containerStatuses: [
          {
            containerID: 'docker://e36217b50b92407e23117964ae1f6106ff15c11262d8a63fe0201e14f9534836',
            image: 'quay.io/mojanalytics/rstudio:v1.3.1',
            imageID: 'docker-pullable://quay.io/mojanalytics/rstudio@sha256:3758eb7dd69e83cbe75ee5538fc57665f2d67fca060da0af0aeac934642172d6',
            lastState: {},
            name: 'r-studio-server',
            ready: true,
            restartCount: 0,
            state: {
              running: {
                startedAt: '2017-12-02T17:45:35Z',
              },
            },
          },
          {
            containerID: 'docker://541a995a907bd07f8bbe9a30d2ff1a104086405470402e5d48c7fe61a8d5740c',
            image: 'quay.io/mojanalytics/rstudio-auth-proxy:v1.2.0',
            imageID: 'docker-pullable://quay.io/mojanalytics/rstudio-auth-proxy@sha256:201ae293c91df0cb1b47e3af7e20841f1b7912be9d02e7daffd70aa4bc6022b9',
            lastState: {},
            name: 'rstudio-auth-proxy',
            ready: true,
            restartCount: 0,
            state: {
              running: {
                startedAt: '2017-12-02T17:43:17Z',
              },
            },
          },
        ],
        hostIP: '192.168.14.177',
        phase: 'Running',
        podIP: '100.79.122.143',
        qosClass: 'Burstable',
        startTime: '2017-12-02T17:41:41Z',
      },
    },
  ],
  kind: 'List',
  metadata: {
    resourceVersion: '',
    selfLink: '',
  },
};
