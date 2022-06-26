FROM gitpod/workspace-full:latest

# Install playwright dependencies
RUN sudo apt-get install libnss3 \
        libnspr4 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libatspi2.0-0

# Install NodeJS
RUN bash -c ". .nvm/nvm.sh \
    && nvm install 18.4.0 \
    && nvm use 18.4.0 \
    && nvm alias default 18.4.0"

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix
