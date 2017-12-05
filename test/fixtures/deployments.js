module.exports = {
    "apiVersion": "v1",
    "items": [
        {
            "apiVersion": "extensions/v1beta1",
            "kind": "Deployment",
            "metadata": {
                "annotations": {
                    "deployment.kubernetes.io/revision": "2"
                },
                "creationTimestamp": "2017-10-17T12:39:44Z",
                "generation": 2,
                "labels": {
                    "app": "rstudio",
                    "chart": "rstudio-1.2.5"
                },
                "name": "andyhd-rstudio-rstudio",
                "namespace": "user-andyhd",
                "resourceVersion": "45724905",
                "selfLink": "/apis/extensions/v1beta1/namespaces/user-andyhd/deployments/andyhd-rstudio-rstudio",
                "uid": "40de5854-b338-11e7-bc33-022284ce4e76"
            },
            "spec": {
                "replicas": 1,
                "selector": {
                    "matchLabels": {
                        "app": "rstudio"
                    }
                },
                "strategy": {
                    "rollingUpdate": {
                        "maxSurge": 1,
                        "maxUnavailable": 1
                    },
                    "type": "RollingUpdate"
                },
                "template": {
                    "metadata": {
                        "annotations": {
                            "iam.amazonaws.com/role": "alpha_user_andyhd"
                        },
                        "creationTimestamp": null,
                        "labels": {
                            "app": "rstudio"
                        }
                    },
                    "spec": {
                        "containers": [
                            {
                                "env": [
                                    {
                                        "name": "USER",
                                        "value": "andyhd"
                                    },
                                    {
                                        "name": "AUTH0_CLIENT_SECRET",
                                        "valueFrom": {
                                            "secretKeyRef": {
                                                "key": "client_secret",
                                                "name": "andyhd-rstudio-rstudio"
                                            }
                                        }
                                    },
                                    {
                                        "name": "AUTH0_CLIENT_ID",
                                        "valueFrom": {
                                            "secretKeyRef": {
                                                "key": "client_id",
                                                "name": "andyhd-rstudio-rstudio"
                                            }
                                        }
                                    },
                                    {
                                        "name": "AUTH0_DOMAIN",
                                        "valueFrom": {
                                            "secretKeyRef": {
                                                "key": "domain",
                                                "name": "andyhd-rstudio-rstudio"
                                            }
                                        }
                                    },
                                    {
                                        "name": "AUTH0_CALLBACK_URL",
                                        "valueFrom": {
                                            "secretKeyRef": {
                                                "key": "callback_url",
                                                "name": "andyhd-rstudio-rstudio"
                                            }
                                        }
                                    },
                                    {
                                        "name": "COOKIE_SECRET",
                                        "valueFrom": {
                                            "secretKeyRef": {
                                                "key": "cookie_secret",
                                                "name": "andyhd-rstudio-rstudio"
                                            }
                                        }
                                    },
                                    {
                                        "name": "SECURE_COOKIE_KEY",
                                        "valueFrom": {
                                            "secretKeyRef": {
                                                "key": "secure_cookie_key",
                                                "name": "andyhd-rstudio-rstudio"
                                            }
                                        }
                                    },
                                    {
                                        "name": "PROXY_TARGET_HOST",
                                        "value": "localhost"
                                    },
                                    {
                                        "name": "PROXY_TARGET_PORT",
                                        "value": "8787"
                                    },
                                    {
                                        "name": "EXPRESS_HOST",
                                        "value": "0.0.0.0"
                                    },
                                    {
                                        "name": "EXPRESS_PORT",
                                        "value": "3000"
                                    }
                                ],
                                "image": "quay.io/mojanalytics/rstudio-auth-proxy:v1.2.0",
                                "imagePullPolicy": "Always",
                                "name": "rstudio-auth-proxy",
                                "ports": [
                                    {
                                        "containerPort": 3000,
                                        "name": "http",
                                        "protocol": "TCP"
                                    }
                                ],
                                "readinessProbe": {
                                    "failureThreshold": 3,
                                    "httpGet": {
                                        "path": "/login?healthz",
                                        "port": "http",
                                        "scheme": "HTTP"
                                    },
                                    "initialDelaySeconds": 5,
                                    "periodSeconds": 5,
                                    "successThreshold": 1,
                                    "timeoutSeconds": 1
                                },
                                "resources": {
                                    "limits": {
                                        "cpu": "100m",
                                        "memory": "128Mi"
                                    },
                                    "requests": {
                                        "cpu": "25m",
                                        "memory": "64Mi"
                                    }
                                },
                                "terminationMessagePath": "/dev/termination-log",
                                "terminationMessagePolicy": "File"
                            },
                            {
                                "env": [
                                    {
                                        "name": "USER",
                                        "value": "andyhd"
                                    },
                                    {
                                        "name": "AWS_DEFAULT_REGION",
                                        "valueFrom": {
                                            "secretKeyRef": {
                                                "key": "aws_default_region",
                                                "name": "andyhd-rstudio-rstudio"
                                            }
                                        }
                                    },
                                    {
                                        "name": "SECURE_COOKIE_KEY",
                                        "valueFrom": {
                                            "secretKeyRef": {
                                                "key": "secure_cookie_key",
                                                "name": "andyhd-rstudio-rstudio"
                                            }
                                        }
                                    },
                                    {
                                        "name": "TOOLS_DOMAIN",
                                        "value": "tools.alpha.mojanalytics.xyz"
                                    }
                                ],
                                "image": "quay.io/mojanalytics/rstudio:v1.3.1",
                                "imagePullPolicy": "Always",
                                "name": "r-studio-server",
                                "ports": [
                                    {
                                        "containerPort": 8787,
                                        "name": "http",
                                        "protocol": "TCP"
                                    }
                                ],
                                "readinessProbe": {
                                    "failureThreshold": 3,
                                    "httpGet": {
                                        "path": "/",
                                        "port": "http",
                                        "scheme": "HTTP"
                                    },
                                    "initialDelaySeconds": 5,
                                    "periodSeconds": 5,
                                    "successThreshold": 1,
                                    "timeoutSeconds": 1
                                },
                                "resources": {
                                    "limits": {
                                        "cpu": "1500m",
                                        "memory": "12Gi"
                                    },
                                    "requests": {
                                        "cpu": "200m",
                                        "memory": "1Gi"
                                    }
                                },
                                "terminationMessagePath": "/dev/termination-log",
                                "terminationMessagePolicy": "File",
                                "volumeMounts": [
                                    {
                                        "mountPath": "/home/andyhd",
                                        "name": "home"
                                    }
                                ]
                            }
                        ],
                        "dnsPolicy": "ClusterFirst",
                        "restartPolicy": "Always",
                        "schedulerName": "default-scheduler",
                        "securityContext": {},
                        "terminationGracePeriodSeconds": 30,
                        "volumes": [
                            {
                                "name": "home",
                                "persistentVolumeClaim": {
                                    "claimName": "nfs-home"
                                }
                            }
                        ]
                    }
                }
            },
            "status": {
                "availableReplicas": 1,
                "conditions": [
                    {
                        "lastTransitionTime": "2017-10-17T12:39:44Z",
                        "lastUpdateTime": "2017-10-17T12:39:44Z",
                        "message": "Deployment has minimum availability.",
                        "reason": "MinimumReplicasAvailable",
                        "status": "True",
                        "type": "Available"
                    }
                ],
                "observedGeneration": 2,
                "readyReplicas": 1,
                "replicas": 1,
                "updatedReplicas": 1
            }
        }
    ],
    "kind": "List",
    "metadata": {
        "resourceVersion": "",
        "selfLink": ""
    }
};
