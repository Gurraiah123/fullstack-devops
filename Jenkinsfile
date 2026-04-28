pipeline {
    agent { label 'slave' }

    tools {
        nodejs "node18"
    }

    environment {
        EC2_IP = "YOUR_EC2_IP"
        DEPLOY_DIR = "/home/ubuntu/app"
    }

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/YOUR_REPO.git'
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Install & Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '
                        rm -rf ${DEPLOY_DIR} &&
                        mkdir -p ${DEPLOY_DIR}
                    '

                    scp -r backend ubuntu@${EC2_IP}:${DEPLOY_DIR}/
                    scp -r frontend/build ubuntu@${EC2_IP}:${DEPLOY_DIR}/frontend

                    ssh ubuntu@${EC2_IP} '
                        cd ${DEPLOY_DIR}/backend &&
                        npm install &&
                        nohup node server.js > output.log 2>&1 &
                        
                        sudo rm -rf /var/www/frontend
                        sudo mkdir -p /var/www/frontend
                        sudo cp -r ${DEPLOY_DIR}/frontend/* /var/www/frontend/
                        sudo systemctl restart nginx
                    '
                    """
                }
            }
        }
    }
}
