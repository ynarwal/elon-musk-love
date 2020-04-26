FROM nginx:1.17.3
EXPOSE 80
COPY dist /usr/share/nginx/html
