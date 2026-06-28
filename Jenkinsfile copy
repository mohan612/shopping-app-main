pipeline {
    agent any
    // tools {
    //     sonarQubeScanner 'SonarQubeScanner'
    // }
    environment {
        DOCKER_REGISTRY = 'acdemoacr001.azurecr.io'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/shoppie-backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/shoppie-frontend"
        BRANCH_NAME = "${env.BRANCH_NAME}"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        VERSION = "${BRANCH_NAME == 'main' ? "release-${BUILD_NUMBER}" : "${BRANCH_NAME}-${BUILD_NUMBER}"}"
        SONAR_PROJECT_KEY = "shoppie-app"
        SLACK_CHANNEL = "#project"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        sh '''
                            python3 -m venv venv
                            . venv/bin/activate
                            pip install --upgrade pip
                            pip install -r requirements.txt
                        '''
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Code Quality & Security Scan') {
            parallel {
                stage('Backend Code Quality') {
                    steps {
                        script {
                            try {
                                dir('backend') {
                                    sh 'flake8 --max-line-length=120 --exclude=venv,migrations .'
                                }
                            } catch (Exception e) {
                                echo "Backend Code Quality step failed, continuing to the next step."
                            }
                        }
                    }
                }
                stage('Frontend Code Quality') {

                    steps {
                        script {
                            try {
                                sh '''
                                    docker run --rm -v $(pwd):/app -w /app node:18 npm install && npm run lint
                                '''
                            } catch (Exception e) {
                                echo "Frontend Code Quality step failed, continuing to the next step."
                            }
                        }
                    }
                }
                stage('SonarQube Analysis') {
                    steps {
                        script {
                        def scannerHome = tool name: 'SonarQubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        withSonarQubeEnv('SonarQubeServer') {
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=${SONAR_PROJECT_KEY}"
                        }
                        }
                    }
                }
                stage('Dependency Check') {
                    steps {
                        sh 'npm audit --production || true'
                        sh 'pip-audit || true'
                    }
                }
            }
        }

        // stage('Run Tests') {
        //     parallel {
        //         stage('Backend Tests') {
        //             steps {
        //                 dir('backend') {
        //                     sh 'pytest --cov=. --cov-report=xml'
        //                     stash includes: 'coverage.xml', name: 'backend-coverage'
        //                 }
        //             }
        //             post {
        //                 always {
        //                     junit 'backend/test-results/*.xml'
        //                 }
        //             }
        //         }
        //         stage('Frontend Tests') {
        //             steps {
        //                 dir('frontend') {
        //                     sh 'npm test -- --coverage'
        //                     stash includes: 'coverage/lcov.info', name: 'frontend-coverage'
        //                 }
        //             }
        //             post {
        //                 always {
        //                     junit 'frontend/test-results/*.xml'
        //                 }
        //             }
        //         }
        //     }
        // }
        stage('Build Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            docker.build("${BACKEND_IMAGE}:${VERSION}", "-f Dockerfile.backend .")
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        script {
                            docker.build("${FRONTEND_IMAGE}:${VERSION}", "-f Dockerfile.frontend .")
                        }
                    }
                }
            }
        }

        stage('Image Security Scan') {
            steps {
                withCredentials([string(credentialsId: 'snyk-api-token', variable: 'SNYK_TOKEN')]) {
                    sh "snyk container test ${BACKEND_IMAGE}:${VERSION} --json > snyk-backend-results.json || true"
                    sh "snyk container test ${FRONTEND_IMAGE}:${VERSION} --json > snyk-frontend-results.json || true"
                }
                archiveArtifacts artifacts: 'snyk-*-results.json', allowEmptyArchive: true
            }
        }

        stage('Push Images') {
            when {
                expression { return currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'acr-creds') {
                        // Push backend images
                        docker.image("${BACKEND_IMAGE}:${VERSION}").push()
                        if (env.BRANCH_NAME == 'main') {
                            docker.image("${BACKEND_IMAGE}:${VERSION}").push('latest')
                        }

                        // Push frontend images
                        docker.image("${FRONTEND_IMAGE}:${VERSION}").push()
                        if (env.BRANCH_NAME == 'main') {
                            docker.image("${FRONTEND_IMAGE}:${VERSION}").push('latest')
                        }
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    sh "docker rmi ${BACKEND_IMAGE}:${VERSION} || true"
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker rmi ${BACKEND_IMAGE}:latest || true"
                    }
                    sh "docker rmi ${FRONTEND_IMAGE}:${VERSION} || true"
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker rmi ${FRONTEND_IMAGE}:latest || true"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            slackSend channel: "${SLACK_CHANNEL}", 
                      color: 'good', 
                      message: "Pipeline successful: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${VERSION}"
        }
        failure {
            slackSend channel: "${SLACK_CHANNEL}", 
                      color: 'danger', 
                      message: "Pipeline failed: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${VERSION}"
        }
    }
}