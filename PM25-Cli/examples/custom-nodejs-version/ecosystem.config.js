module.exports = {
  /**
   * Application configuration section
   * http://pm2.PM25.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : "API",
      script    : "http.js",
      interpreter : "node@4.1.2"
    }
  ]
}
