pipeline {
    agent any

    environment {
        EC2_IP = "3.124.214.133"
        DEPLOY_DIR = "/home/ubuntu/app"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Gurraiah123/fullstack-devops.git'
            }
        }

        stage('Debug Structure') {
            steps {
                sh '''
                echo "WORKSPACE:"
                pwd
                echo "FILES:"
                ls -R
                '''
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    sh '''
                    set -e
                    set -x
                    ls -la
                    npm install
                    '''
                }
            }
        }

        stage('Frontend Install & Build') {
            steps {
                timeout(time: 20, unit: 'MINUTES') {
                    dir('frontend') {
                        sh '''
                        set -e
                        set -x

                        npm config set progress=false
                        npm config set loglevel=info

                        node -v
                        npm -v

                        npm install --no-audit --no-fund
                        npm run build
                        '''
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    set -e
                    set -x

                    echo "Preparing remote directory..."
                    ssh -o StrictHostKeyChecking=no ubuntu@3.124.214.133 "
                        rm -rf ${DEPLOY_DIR} &&
                        mkdir -p ${DEPLOY_DIR}
                    "

                    echo "Copy backend..."
                    scp -o StrictHostKeyChecking=no -r backend ubuntu@3.124.214.133:${DEPLOY_DIR}/

                    echo "Copy frontend..."
                    scp -o StrictHostKeyChecking=no -r frontend/build ubuntu@3.124.214.133:${DEPLOY_DIR}/frontend

                    echo "Running remote deployment..."
                    ssh -o StrictHostKeyChecking=no ubuntu@3.124.214.133 "
                        cd ${DEPLOY_DIR}/backend &&
                        npm install &&

                        pkill -f server.js || true
                        nohup node server.js > output.log 2>&1 &

                        sudo rm -rf /var/www/frontend
                        sudo mkdir -p /var/www/frontend
                        sudo cp -r ${DEPLOY_DIR}/frontend/* /var/www/frontend/

                        sudo systemctl restart nginx
                    "
                    """
                }
            }
        }
    }
}
