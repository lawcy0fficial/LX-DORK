/* ================================================================
   LX-DORK PRO v2.0 — ENTERPRISE RECON FRAMEWORK
   Core Engine — lx-dork.js
   ================================================================ */
'use strict';

/* ══════════════════════════════════════════════
   DATA — CATEGORIES
══════════════════════════════════════════════ */
const CATS = {
  'Exposed Files':      { color:'#ff0022', icon:'📄' },
  'Admin Panels':       { color:'#ff5500', icon:'⚙' },
  'Credentials & Keys': { color:'#ff0022', icon:'🔑' },
  'Directory Listing':  { color:'#ffaa00', icon:'📁' },
  'Subdomains & Infra': { color:'#00e5ff', icon:'🌐' },
  'Login Portals':      { color:'#cc00ff', icon:'🔐' },
  'Error & Debug':      { color:'#00ff41', icon:'🐛' },
  'Documents & PII':    { color:'#0088ff', icon:'📋' },
  'Network & IoT':      { color:'#ff5500', icon:'📡' },
  'CMS & Frameworks':   { color:'#cc00ff', icon:'🧩' },
  'Cloud & SaaS':       { color:'#00e5ff', icon:'☁' },
  'Source Code':        { color:'#00ff41', icon:'💻' },
  'Email & SMTP':       { color:'#0088ff', icon:'✉' },
  'Vuln Signatures':    { color:'#ff0022', icon:'💀' },
  'Supply Chain':       { color:'#ffaa00', icon:'🔗' },
  'Data Stores':        { color:'#ff0022', icon:'🗄' },
  'Healthcare/HIPAA':   { color:'#ff0055', icon:'🏥' },
  'Financial/PCI':      { color:'#ffaa00', icon:'💳' },
  'Government/OSINT':   { color:'#00e5ff', icon:'🏛' },
  'Industrial/OT':      { color:'#ff5500', icon:'⚡' },
  'API & Endpoints':    { color:'#00ffbb', icon:'🔌' },
  'Secrets & Tokens':   { color:'#ff0022', icon:'🗝' },
  'Dev Tools':          { color:'#00ff41', icon:'🛠' },
  'Containers & K8s':   { color:'#00e5ff', icon:'🐳' },
};

/* ══════════════════════════════════════════════
   DATA — DORK DATABASE  (expanded)
══════════════════════════════════════════════ */
const D = [
  /* Exposed Files */
  { c:'Exposed Files', n:'ENV Files',          q:'site:{d} ext:env',                                               r:'critical', src:'GHDB',    desc:'Exposed .env — DB creds, API keys, JWT secrets.' },
  { c:'Exposed Files', n:'Config Files',       q:'site:{d} ext:conf OR ext:config OR ext:cfg',                    r:'critical', src:'GHDB',    desc:'Server/app config files with sensitive settings.' },
  { c:'Exposed Files', n:'SQL Dumps',          q:'site:{d} ext:sql OR ext:dump OR ext:db',                        r:'critical', src:'GHDB',    desc:'Database dumps — schema and live data.' },
  { c:'Exposed Files', n:'Backup Archives',    q:'site:{d} ext:bak OR ext:backup OR ext:old OR ext:tar.gz',       r:'high',     src:'GHDB',    desc:'Backup files with unprotected source code.' },
  { c:'Exposed Files', n:'Log Files',          q:'site:{d} ext:log',                                              r:'high',     src:'GHDB',    desc:'Server logs — paths, IPs, usernames, tokens.' },
  { c:'Exposed Files', n:'YAML Secrets',       q:'site:{d} ext:yml OR ext:yaml inurl:secret OR inurl:deploy',     r:'critical', src:'jhaddix', desc:'CI/CD YAML with hardcoded secrets.' },
  { c:'Exposed Files', n:'Terraform',          q:'site:{d} ext:tf OR ext:tfvars',                                 r:'critical', src:'jhaddix', desc:'IaC files with cloud creds and topology.' },
  { c:'Exposed Files', n:'Docker Compose',     q:'site:{d} inurl:docker-compose.yml',                             r:'critical', src:'jhaddix', desc:'Docker Compose with service secrets.' },
  { c:'Exposed Files', n:'Kubernetes Configs', q:'site:{d} ext:yaml inurl:kubeconfig OR inurl:kube',              r:'critical', src:'curated', desc:'K8s configs with cluster credentials.' },
  { c:'Exposed Files', n:'Properties Files',   q:'site:{d} ext:properties inurl:application OR inurl:database',   r:'critical', src:'jhaddix', desc:'Java application.properties with DB/SMTP creds.' },
  { c:'Exposed Files', n:'Shell Scripts',      q:'site:{d} ext:sh inurl:deploy OR inurl:setup',                   r:'high',     src:'curated', desc:'Deploy scripts with embedded tokens.' },
  { c:'Exposed Files', n:'Private Keys PEM',   q:'site:{d} ext:pem OR ext:key intitle:"index of"',                r:'critical', src:'GHDB',    desc:'PEM private key files.' },
  { c:'Exposed Files', n:'htpasswd',           q:'site:{d} intitle:"index of" ".htpasswd"',                       r:'critical', src:'GHDB',    desc:'.htpasswd with hashed HTTP auth creds.' },
  { c:'Exposed Files', n:'WS_FTP Log',         q:'site:{d} inurl:ws_ftp.log',                                     r:'critical', src:'GHDB',    desc:'WS_FTP logs with FTP credentials.' },
  { c:'Exposed Files', n:'XML Config',         q:'site:{d} ext:xml inurl:config OR inurl:settings',               r:'high',     src:'curated', desc:'XML configuration files.' },
  { c:'Exposed Files', n:'INI Files',          q:'site:{d} ext:ini inurl:config OR inurl:settings',               r:'high',     src:'curated', desc:'INI files with hardcoded values.' },
  { c:'Exposed Files', n:'Ansible Playbooks',  q:'site:{d} ext:yml inurl:playbook OR inurl:ansible',              r:'critical', src:'curated', desc:'Ansible playbooks with server creds/keys.' },
  { c:'Exposed Files', n:'Gemfile / Lockfile', q:'site:{d} inurl:Gemfile.lock OR inurl:package-lock.json',        r:'medium',   src:'curated', desc:'Dependency files revealing library versions.' },

  /* Admin Panels */
  { c:'Admin Panels', n:'Generic Admin',      q:'site:{d} inurl:admin OR inurl:administrator OR inurl:adminpanel', r:'high',     src:'GHDB',    desc:'Admin panels on the target domain.' },
  { c:'Admin Panels', n:'phpMyAdmin',         q:'site:{d} inurl:phpmyadmin OR intitle:"phpMyAdmin"',               r:'critical', src:'GHDB',    desc:'Database management interface.' },
  { c:'Admin Panels', n:'Webmin',             q:'site:{d} inurl:10000 intitle:webmin',                             r:'critical', src:'GHDB',    desc:'Full server admin panel.' },
  { c:'Admin Panels', n:'Jenkins',            q:'site:{d} intitle:"dashboard [jenkins]" OR inurl:/jenkins/',       r:'critical', src:'GHDB',    desc:'CI/CD — build secrets, pipelines.' },
  { c:'Admin Panels', n:'Grafana',            q:'site:{d} inurl:3000 intitle:Grafana',                             r:'medium',   src:'GHDB',    desc:'Monitoring dashboard.' },
  { c:'Admin Panels', n:'Kibana',             q:'site:{d} inurl:5601 intitle:Kibana',                              r:'high',     src:'GHDB',    desc:'Log analytics — full data exposure.' },
  { c:'Admin Panels', n:'Portainer',          q:'site:{d} inurl:9000 intitle:Portainer',                           r:'critical', src:'curated', desc:'Docker management UI.' },
  { c:'Admin Panels', n:'Vault UI',           q:'site:{d} inurl:8200 intitle:"Vault"',                             r:'critical', src:'curated', desc:'HashiCorp Vault — secrets management.' },
  { c:'Admin Panels', n:'Airflow',            q:'site:{d} intitle:"Airflow" inurl:/admin',                         r:'high',     src:'curated', desc:'Airflow DAGs with connection strings.' },
  { c:'Admin Panels', n:'Spring Actuator',    q:'site:{d} inurl:/actuator OR inurl:/actuator/env',                 r:'critical', src:'jhaddix', desc:'Spring Boot — env vars, heap dump, beans.' },
  { c:'Admin Panels', n:'Rancher',            q:'site:{d} inurl:8080 intitle:Rancher',                             r:'critical', src:'curated', desc:'Rancher Kubernetes management.' },
  { c:'Admin Panels', n:'SonarQube',          q:'site:{d} intitle:"SonarQube" inurl:sonar',                        r:'high',     src:'curated', desc:'Code quality scanner — source code access.' },
  { c:'Admin Panels', n:'Consul UI',          q:'site:{d} inurl:8500 intitle:Consul',                              r:'critical', src:'curated', desc:'HashiCorp Consul service mesh UI.' },
  { c:'Admin Panels', n:'Traefik Dashboard',  q:'site:{d} inurl:8080 intitle:Traefik',                             r:'high',     src:'curated', desc:'Traefik reverse proxy dashboard.' },
  { c:'Admin Panels', n:'cPanel',             q:'site:{d} inurl:2082 OR inurl:2083 intitle:cPanel',                r:'critical', src:'GHDB',    desc:'cPanel web hosting control panel.' },
  { c:'Admin Panels', n:'Plesk',              q:'site:{d} inurl:8443 intitle:Plesk',                               r:'critical', src:'GHDB',    desc:'Plesk hosting control panel.' },

  /* Credentials & Keys */
  { c:'Credentials & Keys', n:'AWS Access Keys',   q:'site:{d} "AKIA" filetype:env OR filetype:txt',                          r:'critical', src:'jhaddix', desc:'AWS IAM access key IDs.' },
  { c:'Credentials & Keys', n:'GCP Service Acct',  q:'site:{d} "type" "service_account" "private_key_id" filetype:json',     r:'critical', src:'jhaddix', desc:'GCP service account JSON credentials.' },
  { c:'Credentials & Keys', n:'GitHub PAT',        q:'site:{d} "ghp_" OR "ghs_" filetype:env',                               r:'critical', src:'jhaddix', desc:'GitHub personal access tokens.' },
  { c:'Credentials & Keys', n:'Slack Tokens',      q:'site:{d} "xoxb-" OR "xoxp-" filetype:env',                             r:'critical', src:'jhaddix', desc:'Slack OAuth tokens.' },
  { c:'Credentials & Keys', n:'Stripe Live Keys',  q:'site:{d} "sk_live_" filetype:env OR filetype:js',                      r:'critical', src:'jhaddix', desc:'Stripe live secret API keys.' },
  { c:'Credentials & Keys', n:'Firebase Key',      q:'site:{d} "AIza" filetype:json OR filetype:js',                         r:'high',     src:'jhaddix', desc:'Firebase/GCP API keys.' },
  { c:'Credentials & Keys', n:'Database URLs',     q:'site:{d} "mongodb://" OR "postgres://" OR "mysql://" filetype:env',    r:'critical', src:'jhaddix', desc:'Full DB connection strings with creds.' },
  { c:'Credentials & Keys', n:'JWT Secrets',       q:'site:{d} "JWT_SECRET" OR "SECRET_KEY" filetype:env',                   r:'critical', src:'jhaddix', desc:'JWT signing secrets.' },
  { c:'Credentials & Keys', n:'SSH Keys',          q:'site:{d} intitle:"index of" "id_rsa" OR "id_ecdsa"',                   r:'critical', src:'jhaddix', desc:'SSH private key files.' },
  { c:'Credentials & Keys', n:'NPM Token',         q:'site:{d} "_authToken" filetype:npmrc',                                  r:'critical', src:'jhaddix', desc:'NPM registry auth tokens.' },
  { c:'Credentials & Keys', n:'Twilio Tokens',     q:'site:{d} "TWILIO_AUTH_TOKEN" OR "SK" filetype:env',                    r:'critical', src:'curated', desc:'Twilio API authentication tokens.' },
  { c:'Credentials & Keys', n:'SendGrid Keys',     q:'site:{d} "SENDGRID_API_KEY" filetype:env',                             r:'high',     src:'curated', desc:'SendGrid email API credentials.' },
  { c:'Credentials & Keys', n:'Okta Tokens',       q:'site:{d} "OKTA_API_TOKEN" OR "okta.com" filetype:env',                 r:'critical', src:'curated', desc:'Okta identity platform tokens.' },
  { c:'Credentials & Keys', n:'Azure ClientSecret',q:'site:{d} "AZURE_CLIENT_SECRET" OR "clientSecret" filetype:env',        r:'critical', src:'curated', desc:'Azure AD application secrets.' },

  /* Directory Listing */
  { c:'Directory Listing', n:'Open Root',      q:'site:{d} intitle:"index of /"',                                         r:'high',     src:'GHDB',    desc:'Root directory listing enabled.' },
  { c:'Directory Listing', n:'Git Exposed',    q:'site:{d} inurl:.git intitle:"index of"',                                r:'critical', src:'GHDB',    desc:'.git — full commit history accessible.' },
  { c:'Directory Listing', n:'SVN Exposed',    q:'site:{d} inurl:.svn intitle:"index of"',                                r:'high',     src:'GHDB',    desc:'Subversion repos exposed.' },
  { c:'Directory Listing', n:'Uploads Dir',    q:'site:{d} intitle:"index of" inurl:uploads OR inurl:files',              r:'medium',   src:'GHDB',    desc:'Upload directories publicly accessible.' },
  { c:'Directory Listing', n:'Sensitive Dirs', q:'site:{d} intitle:"index of" "backup" OR "secret" OR "private"',        r:'high',     src:'GHDB',    desc:'Sensitive-named open directories.' },
  { c:'Directory Listing', n:'Logs Dir',       q:'site:{d} intitle:"index of" "logs" OR "log"',                           r:'high',     src:'curated', desc:'Log directory listing.' },
  { c:'Directory Listing', n:'Config Dir',     q:'site:{d} intitle:"index of" "config" OR "conf"',                        r:'high',     src:'curated', desc:'Config directory listing.' },

  /* Subdomains & Infra */
  { c:'Subdomains & Infra', n:'All Subdomains', q:'site:*.{d}',                                               r:'low',      src:'GHDB',    desc:'All indexed subdomains.' },
  { c:'Subdomains & Infra', n:'Dev/Staging',    q:'site:{d} inurl:dev OR inurl:staging OR inurl:uat',        r:'high',     src:'GHDB',    desc:'Dev environments — minimal hardening.' },
  { c:'Subdomains & Infra', n:'Swagger API',    q:'site:{d} inurl:swagger OR intitle:"swagger ui"',          r:'medium',   src:'jhaddix', desc:'Swagger — all API endpoints enumerated.' },
  { c:'Subdomains & Infra', n:'Elasticsearch',  q:'site:{d} inurl:9200 intitle:"Elasticsearch"',             r:'critical', src:'curated', desc:'Exposed Elasticsearch cluster.' },
  { c:'Subdomains & Infra', n:'Prometheus',     q:'site:{d} inurl:9090 intitle:Prometheus',                   r:'high',     src:'curated', desc:'Prometheus metrics exposure.' },
  { c:'Subdomains & Infra', n:'Redis Panel',    q:'site:{d} inurl:6379 OR intitle:"Redis"',                   r:'critical', src:'curated', desc:'Redis admin panel exposure.' },
  { c:'Subdomains & Infra', n:'RabbitMQ',       q:'site:{d} inurl:15672 intitle:RabbitMQ',                    r:'high',     src:'curated', desc:'RabbitMQ management interface.' },

  /* Login Portals */
  { c:'Login Portals', n:'OWA/Exchange',    q:'site:{d} inurl:owa OR intitle:"Outlook Web"',                  r:'medium', src:'GHDB',    desc:'Outlook Web Access portal.' },
  { c:'Login Portals', n:'Citrix Gateway', q:'site:{d} inurl:citrix OR intitle:"Citrix Gateway"',             r:'medium', src:'GHDB',    desc:'Citrix remote desktop gateway.' },
  { c:'Login Portals', n:'Fortinet VPN',   q:'site:{d} inurl:remote/login OR intitle:"FortiGate"',            r:'high',   src:'GHDB',    desc:'Fortinet SSL VPN perimeter.' },
  { c:'Login Portals', n:'Pulse Secure',   q:'site:{d} intitle:"Pulse Secure" OR inurl:dana-na',              r:'high',   src:'curated', desc:'Pulse Secure SSL VPN.' },
  { c:'Login Portals', n:'Palo Alto GP',   q:'site:{d} intitle:"GlobalProtect" inurl:login',                  r:'high',   src:'curated', desc:'Palo Alto GlobalProtect VPN.' },
  { c:'Login Portals', n:'ADFS',           q:'site:{d} inurl:adfs OR intitle:"Sign In - Active Directory"',   r:'high',   src:'curated', desc:'AD Federation Services SSO gateway.' },
  { c:'Login Portals', n:'Duo Auth',       q:'site:{d} inurl:duo OR intitle:"Duo Security"',                   r:'medium', src:'curated', desc:'Duo MFA authentication portal.' },
  { c:'Login Portals', n:'Okta SSO',       q:'site:{d} inurl:okta OR intitle:"Sign In - Okta"',               r:'medium', src:'curated', desc:'Okta SSO login page.' },

  /* Error & Debug */
  { c:'Error & Debug', n:'Stack Traces',    q:'site:{d} intitle:"error" "stack trace" OR "traceback"',         r:'medium', src:'GHDB',    desc:'Stack traces revealing code/libraries.' },
  { c:'Error & Debug', n:'Django Debug',    q:'site:{d} intitle:"DisallowedHost" OR "DEBUG = True"',           r:'high',   src:'jhaddix', desc:'Django debug — full app config exposed.' },
  { c:'Error & Debug', n:'Laravel Whoops',  q:'site:{d} intitle:"Whoops!" inurl:laravel',                      r:'high',   src:'jhaddix', desc:'Laravel debug page.' },
  { c:'Error & Debug', n:'Flask Debugger',  q:'site:{d} "Traceback" "flask" OR inurl:werkzeug',                r:'high',   src:'jhaddix', desc:'Werkzeug debugger — RCE risk.' },
  { c:'Error & Debug', n:'DB Errors',       q:'site:{d} "sql syntax" OR "ORA-" OR "ODBC Error"',               r:'medium', src:'GHDB',    desc:'DB errors revealing SQL/schema.' },
  { c:'Error & Debug', n:'PHP Errors',      q:'site:{d} "PHP Parse error" OR "PHP Fatal error"',               r:'medium', src:'GHDB',    desc:'PHP error messages revealing paths.' },
  { c:'Error & Debug', n:'Node Crash',      q:'site:{d} "UnhandledPromiseRejection" OR "ECONNREFUSED"',        r:'medium', src:'curated', desc:'Node.js crash dumps in public pages.' },

  /* Documents & PII */
  { c:'Documents & PII', n:'Confidential PDFs',   q:'site:{d} ext:pdf "confidential" OR "internal use only"',     r:'high',     src:'GHDB',    desc:'Confidential PDFs indexed publicly.' },
  { c:'Documents & PII', n:'HR Spreadsheets',      q:'site:{d} ext:xlsx "employee" OR "salary" OR "ssn"',          r:'critical', src:'curated', desc:'HR data with PII and compensation.' },
  { c:'Documents & PII', n:'CSV PII',               q:'site:{d} ext:csv "email" OR "credit card" OR "passport"',   r:'critical', src:'curated', desc:'CSV files with PII.' },
  { c:'Documents & PII', n:'Network Diagrams',      q:'site:{d} ext:pdf "network diagram" OR "topology" "internal"', r:'high',   src:'curated', desc:'Internal network diagrams.' },
  { c:'Documents & PII', n:'Word Docs',             q:'site:{d} ext:docx OR ext:doc "confidential"',               r:'medium',   src:'GHDB',    desc:'Confidential Word documents.' },
  { c:'Documents & PII', n:'Passport Scans',        q:'site:{d} ext:pdf OR ext:jpg "passport" "date of birth"',    r:'critical', src:'curated', desc:'Identity documents indexed.' },

  /* Network & IoT */
  { c:'Network & IoT', n:'SCADA/ICS',    q:'site:{d} intitle:"scada" OR intitle:"HMI" OR inurl:scada',               r:'critical', src:'GHDB',    desc:'SCADA/ICS HMI — critical infra.' },
  { c:'Network & IoT', n:'IP Cameras',   q:'site:{d} inurl:axis-cgi OR intitle:"live view" inurl:camera',             r:'high',     src:'GHDB',    desc:'IP camera feeds and admin.' },
  { c:'Network & IoT', n:'Router Admin', q:'site:{d} intitle:"router" inurl:login OR intitle:"DD-WRT"',               r:'high',     src:'GHDB',    desc:'Router admin interfaces.' },
  { c:'Network & IoT', n:'Shodan Link',  q:'site:{d} inurl:shodan.io',                                                 r:'low',      src:'curated', desc:'Shodan.io links from target.' },
  { c:'Network & IoT', n:'SNMP Exposed', q:'site:{d} inurl:snmp OR intitle:"SNMP"',                                   r:'high',     src:'GHDB',    desc:'SNMP management interfaces.' },
  { c:'Network & IoT', n:'Printers',     q:'site:{d} intitle:"printer" inurl:admin OR intitle:"HP LaserJet"',         r:'medium',   src:'GHDB',    desc:'Network printer admin pages.' },
  { c:'Network & IoT', n:'VoIP Systems', q:'site:{d} intitle:"asterisk" OR intitle:"SIP" inurl:admin',                r:'high',     src:'curated', desc:'VoIP/SIP admin interfaces.' },

  /* CMS & Frameworks */
  { c:'CMS & Frameworks', n:'WordPress',     q:'site:{d} inurl:wp-admin OR inurl:wp-login.php',                       r:'medium', src:'GHDB',    desc:'WordPress admin login.' },
  { c:'CMS & Frameworks', n:'Joomla',        q:'site:{d} inurl:administrator/index.php intitle:Joomla',               r:'medium', src:'GHDB',    desc:'Joomla administrator panel.' },
  { c:'CMS & Frameworks', n:'Drupal',        q:'site:{d} inurl:/user/login intitle:Drupal',                            r:'medium', src:'GHDB',    desc:'Drupal admin login.' },
  { c:'CMS & Frameworks', n:'Magento',       q:'site:{d} inurl:/admin intitle:Magento OR inurl:magento',               r:'high',   src:'curated', desc:'Magento e-commerce admin.' },
  { c:'CMS & Frameworks', n:'Shopify Staff', q:'site:{d} inurl:myshopify.com inurl:admin',                             r:'high',   src:'curated', desc:'Shopify staff admin access.' },
  { c:'CMS & Frameworks', n:'Strapi Admin',  q:'site:{d} inurl:/admin inurl:strapi',                                   r:'critical', src:'curated', desc:'Strapi headless CMS admin.' },

  /* Cloud & SaaS */
  { c:'Cloud & SaaS', n:'S3 Buckets',       q:'site:s3.amazonaws.com "{d}"',                                           r:'high',     src:'jhaddix', desc:'AWS S3 buckets for target.' },
  { c:'Cloud & SaaS', n:'Azure Blobs',      q:'site:blob.core.windows.net "{d}"',                                      r:'high',     src:'jhaddix', desc:'Azure Blob Storage exposure.' },
  { c:'Cloud & SaaS', n:'GCS Buckets',      q:'site:storage.googleapis.com "{d}"',                                     r:'high',     src:'jhaddix', desc:'GCP Cloud Storage buckets.' },
  { c:'Cloud & SaaS', n:'Heroku Apps',      q:'site:herokuapp.com "{d}"',                                              r:'medium',   src:'curated', desc:'Heroku deployments for target.' },
  { c:'Cloud & SaaS', n:'Netlify Sites',    q:'site:netlify.app "{d}"',                                                r:'medium',   src:'curated', desc:'Netlify deployments for target.' },
  { c:'Cloud & SaaS', n:'Vercel Deploys',   q:'site:vercel.app "{d}"',                                                 r:'medium',   src:'curated', desc:'Vercel deployments for target.' },
  { c:'Cloud & SaaS', n:'Exposed Lambda',   q:'site:{d} inurl:lambda OR "lambda.amazonaws.com"',                       r:'high',     src:'curated', desc:'AWS Lambda function endpoints.' },
  { c:'Cloud & SaaS', n:'Firebase DB',      q:'site:{d}.firebaseio.com',                                               r:'critical', src:'jhaddix', desc:'Firebase Realtime Database.' },

  /* Source Code */
  { c:'Source Code', n:'GitHub Org',       q:'site:github.com "{d}"',                                                  r:'medium',   src:'curated', desc:'GitHub org/repos for target.' },
  { c:'Source Code', n:'GitLab Public',    q:'site:gitlab.com "{d}"',                                                  r:'medium',   src:'curated', desc:'GitLab repos for target.' },
  { c:'Source Code', n:'Pastebin Dumps',   q:'site:pastebin.com "{d}" password OR key OR token',                      r:'critical', src:'jhaddix', desc:'Pastebin leaks mentioning target.' },
  { c:'Source Code', n:'Gists',            q:'site:gist.github.com "{d}" secret OR key OR password',                  r:'critical', src:'jhaddix', desc:'GitHub Gists leaking target creds.' },
  { c:'Source Code', n:'NPM Packages',     q:'site:npmjs.com "{d}"',                                                   r:'low',      src:'curated', desc:'NPM packages related to target.' },
  { c:'Source Code', n:'Docker Hub',       q:'site:hub.docker.com "{d}"',                                              r:'medium',   src:'curated', desc:'Docker Hub images for target.' },

  /* Email & SMTP */
  { c:'Email & SMTP', n:'Email Lists',     q:'site:{d} ext:txt OR ext:csv "email" "@{d}"',                            r:'medium', src:'GHDB',    desc:'Email address lists.' },
  { c:'Email & SMTP', n:'SMTP Config',     q:'site:{d} "SMTP" "password" OR "MAIL_PASSWORD" filetype:env',            r:'critical', src:'curated', desc:'SMTP credentials in config files.' },
  { c:'Email & SMTP', n:'Mailgun Keys',    q:'site:{d} "MAILGUN_API_KEY" filetype:env',                               r:'high',   src:'curated', desc:'Mailgun API key exposure.' },
  { c:'Email & SMTP', n:'Postfix Config',  q:'site:{d} "postfix" "password" ext:cf OR ext:conf',                      r:'high',   src:'curated', desc:'Postfix mail server config.' },

  /* Vuln Signatures */
  { c:'Vuln Signatures', n:'Log4Shell',       q:'site:{d} "jndi:ldap://" OR "jndi:rmi://"',                           r:'critical', src:'curated', desc:'Log4Shell (CVE-2021-44228) indicators.' },
  { c:'Vuln Signatures', n:'Heartbleed Refs', q:'site:{d} "heartbleed" OR "CVE-2014-0160"',                            r:'high',     src:'curated', desc:'Heartbleed vulnerability references.' },
  { c:'Vuln Signatures', n:'ShellShock',      q:'site:{d} "() { :; };"',                                              r:'critical', src:'curated', desc:'ShellShock (CVE-2014-6271) indicators.' },
  { c:'Vuln Signatures', n:'SQLi Errors',     q:'site:{d} "You have an error in your SQL syntax"',                    r:'high',     src:'GHDB',    desc:'SQL injection error strings.' },
  { c:'Vuln Signatures', n:'LFI Indicators',  q:'site:{d} "../../etc/passwd" OR "root:x:0:0"',                        r:'critical', src:'GHDB',    desc:'Local file inclusion indicators.' },
  { c:'Vuln Signatures', n:'Default Creds',   q:'site:{d} intitle:"Please login" "admin" "password"',                 r:'high',     src:'GHDB',    desc:'Default login pages.' },
  { c:'Vuln Signatures', n:'PHP Info',        q:'site:{d} intitle:"phpinfo()" inurl:phpinfo',                          r:'high',     src:'GHDB',    desc:'phpinfo() page exposing config.' },
  { c:'Vuln Signatures', n:'Apache Struts',   q:'site:{d} inurl:.action OR inurl:.do intitle:"Struts"',               r:'critical', src:'GHDB',    desc:'Apache Struts applications (RCE history).' },

  /* Supply Chain */
  { c:'Supply Chain', n:'Third-Party Scripts', q:'site:{d} inurl:cdn OR inurl:static "integrity="',                   r:'medium', src:'curated', desc:'Third-party JS integrity attributes.' },
  { c:'Supply Chain', n:'CDN References',      q:'site:{d} inurl:cdn.{d}',                                             r:'low',    src:'curated', desc:'CDN subdomain references.' },
  { c:'Supply Chain', n:'Vendor Portals',      q:'site:{d} inurl:vendor OR inurl:supplier OR inurl:partner',          r:'medium', src:'curated', desc:'Vendor/supplier portals.' },
  { c:'Supply Chain', n:'API Dependencies',    q:'site:{d} ext:json "dependencies" "devDependencies"',                 r:'low',    src:'curated', desc:'package.json dependency manifests.' },

  /* Data Stores */
  { c:'Data Stores', n:'MongoDB UI',      q:'site:{d} inurl:28017 OR intitle:"Mongo Express"',                        r:'critical', src:'curated', desc:'MongoDB admin UI or direct port.' },
  { c:'Data Stores', n:'Cassandra',       q:'site:{d} inurl:9042 OR intitle:"Cassandra"',                             r:'critical', src:'curated', desc:'Cassandra DB admin interface.' },
  { c:'Data Stores', n:'Neo4j',           q:'site:{d} inurl:7474 intitle:"Neo4j"',                                    r:'high',     src:'curated', desc:'Neo4j graph database browser.' },
  { c:'Data Stores', n:'InfluxDB',        q:'site:{d} inurl:8086 intitle:InfluxDB',                                   r:'high',     src:'curated', desc:'InfluxDB time series database.' },
  { c:'Data Stores', n:'CouchDB',         q:'site:{d} inurl:5984 intitle:CouchDB',                                    r:'critical', src:'curated', desc:'CouchDB admin UI.' },
  { c:'Data Stores', n:'MinIO',           q:'site:{d} inurl:9001 intitle:MinIO',                                      r:'high',     src:'curated', desc:'MinIO object storage admin.' },

  /* Healthcare/HIPAA */
  { c:'Healthcare/HIPAA', n:'Patient Records',  q:'site:{d} ext:pdf "patient" "date of birth" "diagnosis"',          r:'critical', src:'curated', desc:'PHI/patient data indexed.' },
  { c:'Healthcare/HIPAA', n:'EHR Systems',      q:'site:{d} inurl:ehr OR intitle:"Electronic Health Record"',        r:'high',     src:'curated', desc:'Electronic health record systems.' },
  { c:'Healthcare/HIPAA', n:'HIPAA Certs',      q:'site:{d} "HIPAA" "compliance" ext:pdf',                           r:'low',      src:'curated', desc:'HIPAA compliance documentation.' },

  /* Financial/PCI */
  { c:'Financial/PCI', n:'Credit Card Data',  q:'site:{d} "credit card" "expiry" ext:csv OR ext:txt',                r:'critical', src:'curated', desc:'Credit card data in files.' },
  { c:'Financial/PCI', n:'PCI Reports',       q:'site:{d} "PCI DSS" "audit" ext:pdf',                                r:'medium',   src:'curated', desc:'PCI DSS audit reports.' },
  { c:'Financial/PCI', n:'Banking APIs',      q:'site:{d} inurl:api "account" "balance" "transfer"',                  r:'high',     src:'curated', desc:'Exposed banking API endpoints.' },
  { c:'Financial/PCI', n:'Payment Configs',   q:'site:{d} "stripe" OR "paypal" "secret" filetype:env',               r:'critical', src:'curated', desc:'Payment processor credentials.' },

  /* Government/OSINT */
  { c:'Government/OSINT', n:'FOIA Docs',      q:'site:{d} "FOIA" ext:pdf OR ext:doc',                                r:'low',    src:'curated', desc:'FOIA released documents.' },
  { c:'Government/OSINT', n:'Contracts',      q:'site:{d} "contract" "confidential" ext:pdf',                        r:'medium', src:'curated', desc:'Government contracts and agreements.' },
  { c:'Government/OSINT', n:'Personnel Lists',q:'site:{d} "personnel" "staff directory" ext:pdf OR ext:xlsx',        r:'high',   src:'curated', desc:'Staff directories and org charts.' },

  /* Industrial/OT */
  { c:'Industrial/OT', n:'PLC Interfaces',  q:'site:{d} intitle:"PLC" OR intitle:"Programmable Logic"',              r:'critical', src:'curated', desc:'PLC control interfaces.' },
  { c:'Industrial/OT', n:'MODBUS',          q:'site:{d} inurl:modbus OR intitle:"Modbus"',                           r:'critical', src:'curated', desc:'Modbus industrial protocol interfaces.' },
  { c:'Industrial/OT', n:'BACnet',          q:'site:{d} inurl:bacnet OR intitle:"BACnet"',                           r:'high',     src:'curated', desc:'BACnet building automation systems.' },
  { c:'Industrial/OT', n:'HVAC Systems',    q:'site:{d} intitle:"HVAC" inurl:control OR inurl:monitor',              r:'high',     src:'curated', desc:'HVAC control systems.' },

  /* API & Endpoints */
  { c:'API & Endpoints', n:'GraphQL',         q:'site:{d} inurl:graphql OR inurl:graphiql',                           r:'medium',   src:'curated', desc:'GraphQL endpoints and GraphiQL IDE.' },
  { c:'API & Endpoints', n:'REST API Docs',   q:'site:{d} inurl:/api OR inurl:/api/v1 OR inurl:/api/v2',             r:'low',      src:'curated', desc:'REST API endpoint directories.' },
  { c:'API & Endpoints', n:'API Keys in URLs',q:'site:{d} inurl:api_key= OR inurl:apikey= OR inurl:token=',         r:'critical', src:'jhaddix', desc:'API keys exposed in URLs.' },
  { c:'API & Endpoints', n:'OpenAPI/Redoc',   q:'site:{d} inurl:redoc OR inurl:openapi.json',                        r:'medium',   src:'curated', desc:'OpenAPI/Redoc documentation.' },
  { c:'API & Endpoints', n:'Postman Exports', q:'site:{d} ext:json "postman_collection" OR "postman_environment"',   r:'high',     src:'curated', desc:'Postman collections with API details.' },

  /* Secrets & Tokens */
  { c:'Secrets & Tokens', n:'Vault Secrets',    q:'site:{d} "vault" "secret" ext:json OR ext:env',                   r:'critical', src:'curated', desc:'HashiCorp Vault secret references.' },
  { c:'Secrets & Tokens', n:'OAuth Tokens',     q:'site:{d} "access_token" OR "refresh_token" ext:json',             r:'critical', src:'curated', desc:'OAuth tokens in JSON files.' },
  { c:'Secrets & Tokens', n:'Bearer Tokens',    q:'site:{d} "Authorization: Bearer" ext:log OR ext:txt',             r:'critical', src:'curated', desc:'Bearer tokens in log/text files.' },
  { c:'Secrets & Tokens', n:'API Secrets File', q:'site:{d} inurl:secrets OR inurl:.secrets ext:json OR ext:txt',   r:'critical', src:'curated', desc:'Generic secrets storage files.' },

  /* Dev Tools */
  { c:'Dev Tools', n:'phpinfo',        q:'site:{d} intitle:"phpinfo()"',                                              r:'high',   src:'GHDB',    desc:'PHP configuration information page.' },
  { c:'Dev Tools', n:'Test Pages',     q:'site:{d} inurl:test OR inurl:testing intitle:"test"',                      r:'medium', src:'GHDB',    desc:'Test pages left in production.' },
  { c:'Dev Tools', n:'Debug Panels',   q:'site:{d} inurl:debug OR inurl:/debug intitle:"debug"',                     r:'high',   src:'curated', desc:'Debug mode panels.' },
  { c:'Dev Tools', n:'Sitemap',        q:'site:{d} inurl:sitemap.xml OR inurl:sitemap_index.xml',                    r:'low',    src:'curated', desc:'Sitemaps revealing all paths.' },
  { c:'Dev Tools', n:'Robots.txt',     q:'site:{d} inurl:robots.txt',                                                r:'low',    src:'curated', desc:'Robots.txt with excluded paths.' },
  { c:'Dev Tools', n:'.DS_Store',      q:'site:{d} intitle:"index of" ".DS_Store"',                                  r:'medium', src:'GHDB',    desc:'macOS .DS_Store files (dir structure).' },
  { c:'Dev Tools', n:'Source Maps',    q:'site:{d} ext:map inurl:.js.map OR inurl:.css.map',                         r:'medium', src:'curated', desc:'Source maps revealing unminified code.' },

  /* Containers & K8s */
  { c:'Containers & K8s', n:'K8s API Server',   q:'site:{d} inurl:6443 OR inurl:8080 "kubernetes"',                  r:'critical', src:'curated', desc:'Kubernetes API server exposure.' },
  { c:'Containers & K8s', n:'K8s Dashboard',    q:'site:{d} intitle:"Kubernetes Dashboard"',                          r:'critical', src:'curated', desc:'Kubernetes web dashboard.' },
  { c:'Containers & K8s', n:'Docker Registry',  q:'site:{d} inurl:5000 inurl:v2 OR intitle:"Docker Registry"',       r:'critical', src:'curated', desc:'Docker registry API.' },
  { c:'Containers & K8s', n:'Helm Charts',      q:'site:{d} inurl:Chart.yaml OR ext:yaml "apiVersion" "helm"',       r:'medium',   src:'curated', desc:'Helm chart manifests.' },
  { c:'Containers & K8s', n:'etcd Exposed',     q:'site:{d} inurl:2379 OR inurl:etcd',                               r:'critical', src:'curated', desc:'etcd key-value store (K8s secrets).' },
];

/* ══════════════════════════════════════════════
   DATA — WORDLISTS (GitHub raw URLs)
══════════════════════════════════════════════ */
const WORDLISTS = [
  { cat:'Web Dirs',     name:'SecLists Common',        url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt',         desc:'Common web directory wordlist ~4.7k entries.',   size:'4.7k' },
  { cat:'Web Dirs',     name:'SecLists Big',            url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/big.txt',            desc:'Large web content wordlist ~20k entries.',       size:'20k' },
  { cat:'Web Dirs',     name:'SecLists Raft Medium',    url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/raft-medium-directories.txt', desc:'Raft medium directories ~30k.',         size:'30k' },
  { cat:'Web Dirs',     name:'SecLists API Routes',     url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/api/api-endpoints.txt', desc:'Common API endpoint paths.',              size:'~2k' },
  { cat:'Passwords',    name:'RockYou (Top 1k)',        url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-1000.txt', desc:'Top 1000 RockYou passwords.', size:'1k' },
  { cat:'Passwords',    name:'Top 10k Passwords',       url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-10000.txt', desc:'Top 10k common passwords.', size:'10k' },
  { cat:'Passwords',    name:'Default Credentials',     url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Default-Credentials/default-passwords.csv', desc:'Device default credentials.',       size:'~1k' },
  { cat:'Usernames',    name:'Common Usernames',        url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Usernames/Names/names.txt',                desc:'Common first/last names as usernames.',          size:'~10k' },
  { cat:'Usernames',    name:'xato-net Usernames',      url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Usernames/xato-net-10-million-usernames-dup.txt', desc:'10M username dataset (top entries).',   size:'10M' },
  { cat:'Subdomains',   name:'SecLists Subdomains',     url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/DNS/subdomains-top1million-5000.txt', desc:'Top 5k subdomain wordlist.',            size:'5k' },
  { cat:'Subdomains',   name:'Jhaddix All DNS',         url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/DNS/dns-Jhaddix.txt',            desc:'Jhaddix compiled DNS wordlist.',                size:'~1M' },
  { cat:'Subdomains',   name:'n0kovo Subdomains',       url:'https://raw.githubusercontent.com/n0kovo/n0kovo_subdomains/main/n0kovo_subdomains_tiny.txt',                 desc:'Curated tiny subdomain list.',                  size:'~1k' },
  { cat:'Fuzzing',      name:'Fuzzing Full',            url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/fuzz-Bo0oM.txt',                   desc:'HTTP fuzzing wordlist.',                        size:'~4k' },
  { cat:'Fuzzing',      name:'LFI Linux',               url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/LFI/LFI-LFISuite-pathtotest.txt', desc:'Linux LFI path traversal list.',                size:'~1k' },
  { cat:'Fuzzing',      name:'SQLi Payloads',           url:'https://raw.githubusercontent.com/payloadbox/sql-injection-payload-list/master/Intruder/detect/Generic_SQLI.txt', desc:'Generic SQL injection payloads.',       size:'~1k' },
  { cat:'Fuzzing',      name:'XSS Payloads',            url:'https://raw.githubusercontent.com/payloadbox/xss-payload-list/master/Intruder/xss-payload-list.txt',        desc:'XSS injection payloads.',                       size:'~3k' },
  { cat:'Extensions',   name:'Web Extensions',          url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/web-extensions.txt', desc:'Web file extension list.',                      size:'~100' },
  { cat:'Extensions',   name:'Backup Extensions',       url:'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/raft-small-extensions.txt', desc:'File extensions including backups.',    size:'~200' },
  { cat:'Dork Lists',   name:'Google Dorks DB',         url:'https://raw.githubusercontent.com/BullsEye0/google_dork_list/master/google_Dorks.txt',                      desc:'Massive list of Google dorks.',                 size:'~10k' },
  { cat:'Dork Lists',   name:'PentestGPT Dorks',        url:'https://raw.githubusercontent.com/alphahunter18/Google-Dork/main/google-dorking.txt',                       desc:'Curated pentesting Google dorks.',               size:'~1k' },
];

/* ══════════════════════════════════════════════
   STATE
══════════════════════════════════════════════ */
let sel = new Set();
let activeCat = 'all';
let activeRisk = null;
let searchQ = '';
let sessions = {};
let activeSession = null;
let scopeIn = [], scopeOut = [];
let savedDorks = [];
let builtParts = [];
let browserTabs = [];
let activeBrowserTab = null;
let loadedWordlists = {};
let activeWLCat = 'All';

/* ══════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════ */
function dl(content, type, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
}

function toast(msg, kind = 'ok', duration = 2400) {
  const wrap = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast' + (kind === 'err' ? ' err' : kind === 'info' ? ' info' : kind === 'warn' ? ' warn' : '');
  el.textContent = '▸ ' + msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 450); }, duration);
}

function buildQ(d) {
  const tgt = document.getElementById('global-target').value.trim();
  let q = d.q;
  q = tgt ? q.replace(/{d}/g, tgt) : q.replace(/site:\*?\{d\}\s?/g,'').replace(/{d}/g,'');
  return q.trim();
}

function buildQStatic(d, target) {
  let q = d.q;
  q = target ? q.replace(/{d}/g, target) : q.replace(/site:\*?\{d\}\s?/g,'').replace(/{d}/g,'');
  return q.trim();
}

function getUrl(d) { return `https://www.google.com/search?q=${encodeURIComponent(buildQ(d))}`; }
function getUrlStatic(d, t) { return `https://www.google.com/search?q=${encodeURIComponent(buildQStatic(d,t))}`; }

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
function init() {
  buildCategoryList();
  renderDorks();
  buildOpGrid();
  renderSavedDorks();
  populateReportSess();
  renderWLSidebar();
  renderWLContent();
  initBrowserTab();
  document.getElementById('hp-tot').textContent = D.length + ' DORKS';
  document.getElementById('sb-tot').textContent = D.length;
  updateRiskCounts();

  // Global search handler
  document.getElementById('global-target').addEventListener('input', () => renderDorks());
  document.getElementById('dork-search').addEventListener('input', e => { searchQ = e.target.value.toLowerCase(); renderDorks(); });
}

/* ══════════════════════════════════════════════
   TABS
══════════════════════════════════════════════ */
function showTab(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  document.getElementById('panel-' + id).classList.add('on');
  if (el) el.classList.add('on');
  if (id === 'report') populateReportSess();
}

/* ══════════════════════════════════════════════
   DORK CONSOLE
══════════════════════════════════════════════ */
function buildCategoryList() {
  const el = document.getElementById('catlist');
  el.innerHTML = Object.entries(CATS).map(([name, data]) => {
    const count = D.filter(d => d.c === name).length;
    return `<button class="cb" onclick="setCat('${name.replace(/'/g,"\\'")}')" id="cb-${btoa(name).replace(/=/g,'')}">
      <span class="ci">${data.icon}</span>${name}<span class="cc">${count}</span>
    </button>`;
  }).join('');
}

function updateRiskCounts() {
  ['critical','high','medium','low'].forEach(r => {
    const el = document.getElementById('rc-' + r[0]);
    if (el) el.textContent = D.filter(d => d.r === r).length;
  });
  const el = document.getElementById('cc-all');
  if (el) el.textContent = D.length;
}

function getVisible() {
  return D.filter(d => {
    if (activeCat !== 'all' && d.c !== activeCat) return false;
    if (activeRisk && d.r !== activeRisk) return false;
    if (searchQ && !d.n.toLowerCase().includes(searchQ) && !d.desc.toLowerCase().includes(searchQ) && !d.q.toLowerCase().includes(searchQ)) return false;
    return true;
  });
}

function renderDorks() {
  const visible = getVisible();
  const grid = document.getElementById('dork-grid');
  const rb = { critical:'rc2', high:'rh2', medium:'rm2', low:'rl2' };

  document.getElementById('sb-filt').textContent = visible.length;
  document.getElementById('sb-sel').textContent = sel.size;
  document.getElementById('hp-sel').textContent = sel.size + ' SEL';

  if (!visible.length) {
    grid.innerHTML = '<div class="nr">// NO DORKS MATCH FILTER</div>';
    return;
  }

  grid.innerHTML = visible.map(d => {
    const col = CATS[d.c]?.color || '#ff0022';
    const q = buildQ(d);
    return `<div class="card ${sel.has(d.n)?'sl':''}" style="--cc:${col}" onclick="toggleSel('${d.n.replace(/'/g,"\\'")}')">
      <div class="ch">
        <div class="cn">${d.n}</div>
        <span class="rb ${rb[d.r]}">${d.r.toUpperCase()}</span>
      </div>
      <div class="cq">${d.q.replace(/{d}/g,'<span style="color:#fff">{target}</span>')}</div>
      <div class="cd">${d.desc}</div>
      <div class="csrc">SRC: ${d.src} // CAT: ${d.c}</div>
    </div>`;
  }).join('');
  updatePreview();
}

function toggleSel(name) {
  sel.has(name) ? sel.delete(name) : sel.add(name);
  renderDorks();
}

function setCat(cat) {
  activeCat = cat;
  activeRisk = null;
  document.querySelectorAll('.cb').forEach(b => b.classList.remove('ac'));
  const id = cat === 'all' ? 'cb-all' : 'cb-' + btoa(cat).replace(/=/g,'');
  const el = document.getElementById(id);
  if (el) el.classList.add('ac');
  renderDorks();
}

function setRisk(r) {
  activeRisk = (activeRisk === r) ? null : r;
  activeCat = 'all';
  document.querySelectorAll('.cb').forEach(b => b.classList.remove('ac'));
  renderDorks();
}

function setFilter(f, btn) {
  document.querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
  if (f === 'critical' || f === 'high') { activeRisk = f; activeCat = 'all'; btn.classList.add('on'); }
  else if (f === 'all') { activeRisk = null; activeCat = 'all'; }
  else { activeRisk = null; activeCat = 'all'; }
  renderDorks();
}

function selAll() {
  getVisible().forEach(d => sel.add(d.n));
  renderDorks();
}

function selCrit() {
  D.filter(d => d.r === 'critical').forEach(d => sel.add(d.n));
  renderDorks();
}

function selNone() { sel.clear(); renderDorks(); }

function selHigh() {
  D.filter(d => d.r === 'critical' || d.r === 'high').forEach(d => sel.add(d.n));
  renderDorks();
}

function updatePreview() {
  const el = document.getElementById('dork-preview');
  const si = document.getElementById('si2-count');
  if (sel.size === 0) {
    el.textContent = '// select dork to preview query';
    si.textContent = '0 SELECTED';
    return;
  }
  const last = [...sel].pop();
  const d = D.find(x => x.n === last);
  if (d) el.textContent = buildQ(d);
  si.textContent = sel.size + ' SEL';
}

function launchSelected() {
  if (!sel.size) { toast('Select at least one dork', 'warn'); return; }
  let opened = 0;
  [...sel].slice(0, 10).forEach((name, i) => {
    const d = D.find(x => x.n === name);
    if (d) setTimeout(() => window.open(getUrl(d), '_blank'), i * 300);
    opened++;
  });
  toast(`Launched ${opened} dork(s)`, 'ok');
}

function launchInBrowser() {
  if (!sel.size) { toast('Select a dork first', 'warn'); return; }
  const name = [...sel].pop();
  const d = D.find(x => x.n === name);
  if (!d) return;
  const url = getUrl(d);
  showTab('browser', document.querySelector('.tab[onclick*="browser"]'));
  openBrowserTab(url, d.n);
  toast('Opened in integrated browser', 'info');
}

function copyQuery() {
  if (!sel.size) { toast('Select a dork first', 'warn'); return; }
  const name = [...sel].pop();
  const d = D.find(x => x.n === name);
  if (!d) return;
  navigator.clipboard?.writeText(buildQ(d));
  toast('Query copied', 'ok');
}

function exportSelected() {
  if (!sel.size) { toast('Nothing selected', 'warn'); return; }
  const lines = ['# LX-DORK PRO — Selected Dork Export', `# Date: ${new Date().toISOString()}`, `# Target: ${document.getElementById('global-target').value || 'N/A'}`, ''];
  [...sel].forEach(name => {
    const d = D.find(x => x.n === name);
    if (d) {
      lines.push(`# ${d.n} [${d.r.toUpperCase()}] — ${d.c}`);
      lines.push(buildQ(d));
      lines.push('');
    }
  });
  dl(lines.join('\n'), 'text/plain', 'lx-dork-selected.txt');
  toast('Exported ' + sel.size + ' dorks', 'ok');
}

/* ══════════════════════════════════════════════
   INTEGRATED BROWSER
══════════════════════════════════════════════ */
function initBrowserTab() {
  openBrowserTab('', 'New Tab');
}

function openBrowserTab(url, title) {
  const id = 'tab_' + Date.now();
  browserTabs.push({ id, url, title: title || url.split('/')[2] || 'New Tab' });
  activeBrowserTab = id;
  renderBrowserTabs();
  loadBrowserUrl(url, id);
}

function renderBrowserTabs() {
  const bar = document.getElementById('browser-tabs-bar');
  bar.innerHTML = browserTabs.map(t =>
    `<div class="btab ${activeBrowserTab === t.id ? 'on' : ''}" onclick="switchBrowserTab('${t.id}')">
      <span style="overflow:hidden;text-overflow:ellipsis;max-width:130px">${t.title}</span>
      <span class="btab-close" onclick="closeBrowserTab(event,'${t.id}')">✕</span>
    </div>`
  ).join('') + `<button class="btab-new" onclick="openBrowserTab('','New Tab')">+</button>`;
}

function switchBrowserTab(id) {
  activeBrowserTab = id;
  const t = browserTabs.find(x => x.id === id);
  renderBrowserTabs();
  if (t) loadBrowserUrl(t.url, id);
}

function closeBrowserTab(e, id) {
  e.stopPropagation();
  browserTabs = browserTabs.filter(t => t.id !== id);
  if (activeBrowserTab === id) activeBrowserTab = browserTabs[browserTabs.length - 1]?.id || null;
  renderBrowserTabs();
  if (!browserTabs.length) openBrowserTab('', 'New Tab');
}

function loadBrowserUrl(url, tabId) {
  const frame = document.getElementById('browser-frame');
  const placeholder = document.getElementById('browser-placeholder');
  const urlBar = document.getElementById('browser-url-bar');
  const status = document.getElementById('browser-status-text');

  if (url) {
    frame.style.display = 'block';
    placeholder.style.display = 'none';
    frame.src = url;
    urlBar.value = url;
    status.textContent = 'Loading: ' + url;
    const t = browserTabs.find(x => x.id === tabId);
    if (t) t.url = url;
    frame.onload = () => { status.textContent = 'Loaded: ' + url; };
  } else {
    frame.style.display = 'none';
    placeholder.style.display = 'flex';
    urlBar.value = '';
    status.textContent = 'Ready';
  }
}

function browserNav() {
  const url = document.getElementById('browser-url-bar').value.trim();
  if (!url) return;
  const fullUrl = url.startsWith('http') ? url : 'https://' + url;
  loadBrowserUrl(fullUrl, activeBrowserTab);
  const t = browserTabs.find(x => x.id === activeBrowserTab);
  if (t) { t.title = fullUrl.split('/')[2] || fullUrl; renderBrowserTabs(); }
}

function browserBack() {
  const frame = document.getElementById('browser-frame');
  try { frame.contentWindow.history.back(); } catch(e) {}
}
function browserForward() {
  const frame = document.getElementById('browser-frame');
  try { frame.contentWindow.history.forward(); } catch(e) {}
}
function browserRefresh() {
  const frame = document.getElementById('browser-frame');
  try { frame.contentWindow.location.reload(); } catch(e) { frame.src = frame.src; }
}

function browserQuickSearch(query) {
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
  loadBrowserUrl(url, activeBrowserTab);
  const t = browserTabs.find(x => x.id === activeBrowserTab);
  if (t) { t.title = query.substring(0, 25) + '...'; renderBrowserTabs(); }
}

function browserOpenUrl() {
  const url = document.getElementById('browser-url-bar').value.trim();
  if (!url) return;
  window.open(url.startsWith('http') ? url : 'https://' + url, '_blank');
}

/* ══════════════════════════════════════════════
   WORDLIST MANAGER
══════════════════════════════════════════════ */
function renderWLSidebar() {
  const cats = ['All', ...new Set(WORDLISTS.map(w => w.cat))];
  const el = document.getElementById('wl-sidebar');
  el.innerHTML = cats.map(c =>
    `<button class="wl-cat-btn ${activeWLCat === c ? 'ac' : ''}" onclick="setWLCat('${c}')">${c} <span style="float:right;color:var(--muted)">${c === 'All' ? WORDLISTS.length : WORDLISTS.filter(w=>w.cat===c).length}</span></button>`
  ).join('');
}

function setWLCat(cat) {
  activeWLCat = cat;
  renderWLSidebar();
  renderWLContent();
}

function renderWLContent() {
  const lists = activeWLCat === 'All' ? WORDLISTS : WORDLISTS.filter(w => w.cat === activeWLCat);
  const el = document.getElementById('wl-content');

  el.innerHTML = lists.map((w, i) => {
    const loaded = loadedWordlists[w.name];
    return `<div class="wl-card">
      <div>
        <div class="wl-name">${w.name}</div>
        <div class="wl-meta">CAT: ${w.cat} // SIZE: ${w.size} // SRC: GitHub</div>
        <div class="wl-desc">${w.desc}</div>
        ${loaded ? `<div class="wl-preview">${loaded.preview}</div>
        <div style="font-size:9px;color:var(--teal);margin-top:4px">✓ LOADED — ${loaded.count} entries</div>` : ''}
      </div>
      <div class="wl-btns">
        <button class="btn bt" onclick="fetchWordlist(${WORDLISTS.indexOf(w)})">⬇ FETCH</button>
        <button class="btn bc" onclick="viewWordlist(${WORDLISTS.indexOf(w)})">👁 VIEW</button>
        <button class="btn by" onclick="copyWLUrl(${WORDLISTS.indexOf(w)})">⎘ URL</button>
        ${loaded ? `<button class="btn bg" onclick="exportWordlist('${w.name}')">⬇ SAVE</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function fetchWordlist(idx) {
  const w = WORDLISTS[idx];
  toast('Fetching: ' + w.name + '...', 'info', 3000);
  fetch(w.url)
    .then(r => r.text())
    .then(text => {
      const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('#'));
      loadedWordlists[w.name] = {
        content: text,
        lines,
        count: lines.length,
        preview: lines.slice(0, 20).join('\n')
      };
      toast('Loaded: ' + lines.length + ' entries from ' + w.name, 'ok');
      renderWLContent();
    })
    .catch(e => {
      toast('Fetch failed — CORS restriction. Use "URL" to access directly.', 'err', 4000);
    });
}

function viewWordlist(idx) {
  const w = WORDLISTS[idx];
  const loaded = loadedWordlists[w.name];
  if (!loaded) { toast('Fetch the wordlist first', 'warn'); return; }
  const modal = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = w.name + ' — ' + loaded.count + ' ENTRIES';
  document.getElementById('modal-body').innerHTML = `<div style="background:#000;border:1px solid #00ffbb22;padding:8px;font-family:var(--mono);font-size:9px;color:var(--teal);line-height:1.8;max-height:50vh;overflow-y:auto;white-space:pre">${loaded.lines.slice(0,500).join('\n')}${loaded.lines.length > 500 ? '\n... [showing 500 of ' + loaded.lines.length + ']' : ''}</div>`;
  modal.classList.add('on');
}

function copyWLUrl(idx) {
  navigator.clipboard?.writeText(WORDLISTS[idx].url);
  toast('URL copied: ' + WORDLISTS[idx].name, 'ok');
}

function exportWordlist(name) {
  const loaded = loadedWordlists[name];
  if (!loaded) return;
  dl(loaded.content, 'text/plain', name.replace(/\s/g, '-').toLowerCase() + '.txt');
  toast('Saved: ' + name, 'ok');
}

function fetchAllVisible() {
  const lists = activeWLCat === 'All' ? WORDLISTS : WORDLISTS.filter(w => w.cat === activeWLCat);
  toast('Fetching ' + lists.length + ' wordlists...', 'info', 5000);
  lists.forEach((w, i) => setTimeout(() => fetchWordlist(WORDLISTS.indexOf(w)), i * 800));
}

/* ══════════════════════════════════════════════
   CAMPAIGN / SESSION MANAGER
══════════════════════════════════════════════ */
function createSession() {
  const name   = document.getElementById('new-sess-name').value.trim();
  const target = document.getElementById('new-sess-target').value.trim();
  const tester = document.getElementById('new-sess-tester').value.trim();
  const eng    = document.getElementById('new-sess-eng').value;
  if (!name) { toast('Session name required', 'warn'); return; }
  const id = 'sess_' + Date.now();
  sessions[id] = { id, name, target, tester, eng, created: new Date().toISOString(), dorks: {} };
  ['new-sess-name','new-sess-target','new-sess-tester'].forEach(i => document.getElementById(i).value = '');
  activeSession = id;
  updateSessUI();
  loadSession(id);
  toast('Session created: ' + name, 'ok');
}

function switchSession() {
  const v = document.getElementById('sess-sel').value;
  if (v) loadSession(v);
}

function setStatus(sid, name, status) {
  if (!sessions[sid]) return;
  sessions[sid].dorks[name] = { ...sessions[sid].dorks[name], status };
  loadSession(sid);
}

function updateNote(sid, name, note) {
  if (!sessions[sid] || !sessions[sid].dorks[name]) return;
  sessions[sid].dorks[name].note = note;
}

function removeDorkFromSess(sid, name) {
  if (!sessions[sid]) return;
  delete sessions[sid].dorks[name];
  loadSession(sid);
}

function deleteSession(id) {
  if (!confirm('Delete this session?')) return;
  delete sessions[id];
  if (activeSession === id) activeSession = null;
  document.getElementById('camp-main').innerHTML = '<div style="font-family:var(--vt);font-size:18px;color:var(--muted);letter-spacing:2px;text-align:center;margin-top:40px">// CREATE OR SELECT A SESSION</div>';
  updateSessUI();
  toast('Session deleted', 'warn');
}

function exportSession(id) {
  const sess = sessions[id]; if (!sess) return;
  const lines = [`# SESSION: ${sess.name}`, `# TARGET: ${sess.target}`, `# TESTER: ${sess.tester}`, `# ENG: ${sess.eng||'N/A'}`, ``];
  const hits = Object.entries(sess.dorks).filter(([,v]) => v.status === 'hit');
  lines.push(`## HITS (${hits.length})`);
  hits.forEach(([n,v]) => {
    const d = D.find(x => x.n === n);
    lines.push(`- ${n}: ${d ? buildQStatic(d, sess.target) : ''}`);
    if (v.note) lines.push(`  NOTE: ${v.note}`);
  });
  dl(lines.join('\n'), 'text/plain', `session-${sess.name.replace(/\s/g,'-')}.txt`);
  toast('Session exported', 'ok');
}

function addToSession() {
  if (!activeSession) { toast('Create or select a session first', 'warn'); return; }
  if (!sel.size)      { toast('Select dorks first', 'warn'); return; }
  const sess = sessions[activeSession];
  [...sel].forEach(n => { if (!sess.dorks[n]) sess.dorks[n] = { status:'', note:'' }; });
  updateSessUI();
  loadSession(activeSession);
  toast(sel.size + ' dork(s) added to session', 'ok');
}

function addSelToSession() { addToSession(); }

function updateSessUI() {
  const entries = Object.values(sessions);
  document.getElementById('sess-list').innerHTML = entries.length
    ? entries.map(s => `
      <div class="camp-card ${activeSession === s.id ? 'ac2' : ''}" onclick="loadSession('${s.id}')">
        <div class="camp-name">${s.name}</div>
        <div class="camp-meta">TARGET: ${s.target||'N/A'} // ${s.tester||'anon'}</div>
        <div class="camp-stat">
          <span style="background:#00ff4111;border:1px solid #00ff4133;color:var(--green)">${Object.values(s.dorks).filter(x=>x.status==='hit').length} HIT</span>
          <span style="background:#ff002211;border:1px solid #ff002233;color:var(--red)">${Object.values(s.dorks).filter(x=>x.status==='miss').length} MISS</span>
          <span style="color:var(--muted);font-size:9px">${Object.keys(s.dorks).length} dorks</span>
        </div>
      </div>`
    ).join('') : '<div style="font-size:9px;color:var(--muted)">// no sessions</div>';

  const sd = document.getElementById('sess-sel');
  sd.innerHTML = '<option value="">-- none --</option>' + entries.map(s =>
    `<option value="${s.id}" ${activeSession === s.id ? 'selected':''}>${s.name}</option>`
  ).join('');

  if (activeSession && sessions[activeSession]) {
    document.getElementById('hp-camp').textContent = sessions[activeSession].name.substring(0,12).toUpperCase();
    document.getElementById('sb-sess').textContent = sessions[activeSession].name.substring(0,16);
  }
}

function loadSession(id) {
  activeSession = id;
  const sess = sessions[id]; if (!sess) return;
  const rb = { critical:'rc2', high:'rh2', medium:'rm2', low:'rl2' };
  const main = document.getElementById('camp-main');

  const hitCnt  = Object.values(sess.dorks).filter(x=>x.status==='hit').length;
  const missCnt = Object.values(sess.dorks).filter(x=>x.status==='miss').length;
  const skipCnt = Object.values(sess.dorks).filter(x=>x.status==='skip').length;

  main.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
      <div>
        <div style="font-family:var(--orb);font-size:14px;color:var(--red);letter-spacing:2px">${sess.name}</div>
        <div style="font-size:9px;color:var(--muted)">TARGET: ${sess.target||'N/A'} // TESTER: ${sess.tester||'N/A'} // ENG: ${sess.eng||'N/A'}</div>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        <button class="btn bg" onclick="addSelToSession()">+ ADD SELECTED</button>
        <button class="btn by" onclick="exportSession('${id}')">⬇ EXPORT</button>
        <button class="btn bdng" onclick="deleteSession('${id}')">✗ DELETE</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="pill pg">${hitCnt} HITS</div>
      <div class="pill pr">${missCnt} MISSES</div>
      <div class="pill py">${skipCnt} SKIPPED</div>
      <div class="pill pc">${Object.keys(sess.dorks).length} TOTAL</div>
    </div>
    <div style="height:3px;background:var(--border);border-radius:1px;overflow:hidden">
      <div style="height:100%;background:var(--green);width:${Object.keys(sess.dorks).length ? Math.round(hitCnt/Object.keys(sess.dorks).length*100) : 0}%;transition:width .5s;box-shadow:var(--gr)"></div>
    </div>
    ${Object.keys(sess.dorks).length === 0 ? '<div style="font-family:var(--vt);font-size:16px;color:var(--muted);text-align:center;margin-top:20px">// NO DORKS — ADD FROM DORK CONSOLE</div>' : ''}
    <div style="display:flex;flex-direction:column;gap:4px">
    ${Object.entries(sess.dorks).map(([name, data]) => {
      const d = D.find(x => x.n === name);
      const col = d ? CATS[d.c]?.color || '#ff0022' : '#ff0022';
      const esc = name.replace(/'/g,"\\'").replace(/\\/g,'');
      return `<div class="dork-result" style="border-left:2px solid ${col}">
        <div>
          <div style="font-size:10px;color:#cdd8e8;font-weight:bold">${name} ${d ? `<span class="rb ${rb[d?.r||'low']}">${(d?.r||'').toUpperCase()}</span>` : ''}</div>
          <div style="font-size:8px;color:${col};opacity:.7;margin-top:2px">${d ? buildQStatic(d, sess.target) : ''}</div>
          <input class="dr-note" placeholder="Add finding notes..." value="${data.note||''}" oninput="updateNote('${id}','${esc}',this.value)">
        </div>
        <div class="result-btns">
          <button class="rs rs-hit ${data.status==='hit'?'on':''}" onclick="setStatus('${id}','${esc}','hit')">HIT</button>
          <button class="rs rs-miss ${data.status==='miss'?'on':''}" onclick="setStatus('${id}','${esc}','miss')">MISS</button>
          <button class="rs rs-skip ${data.status==='skip'?'on':''}" onclick="setStatus('${id}','${esc}','skip')">SKIP</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:3px">
          ${d ? `<button class="btn bc" style="font-size:11px;padding:3px 8px" onclick="window.open('${getUrlStatic(d,sess.target)}','_blank')">LAUNCH</button>
                 <button class="btn bt" style="font-size:11px;padding:3px 8px" onclick="showTab('browser');openBrowserTab('${getUrlStatic(d,sess.target)}','${name}')">IN BROWSER</button>` : ''}
          <button class="rs rs-miss" onclick="removeDorkFromSess('${id}','${esc}')">REMOVE</button>
        </div>
      </div>`;
    }).join('')}
    </div>`;
  updateSessUI();
}

/* ══════════════════════════════════════════════
   SCOPE MANAGER
══════════════════════════════════════════════ */
function addScope(type) {
  const inp = document.getElementById(type + '-scope-inp');
  const val = inp.value.trim(); if (!val) return;
  if (type === 'in') scopeIn.push(val); else scopeOut.push(val);
  inp.value = '';
  renderScope();
  document.getElementById('hp-scope').textContent = (scopeIn.length + scopeOut.length) + ' TARGETS';
  document.getElementById('sb-sin').textContent = scopeIn.length;
  document.getElementById('sb-sout').textContent = scopeOut.length;
}

function renderScope() {
  document.getElementById('in-scope-list').innerHTML = scopeIn.map((s,i) =>
    `<div class="scope-item scope-in"><span>✓</span><span>${s}</span><button class="scope-del" onclick="delScope('in',${i})">✗</button></div>`
  ).join('');
  document.getElementById('out-scope-list').innerHTML = scopeOut.map((s,i) =>
    `<div class="scope-item scope-out"><span>✗</span><span>${s}</span><button class="scope-del" onclick="delScope('out',${i})">✗</button></div>`
  ).join('');
}

function delScope(type, i) { if (type==='in') scopeIn.splice(i,1); else scopeOut.splice(i,1); renderScope(); }

function exportScope() {
  const lines = [`# ENGAGEMENT SCOPE`, `# CLIENT: ${document.getElementById('scope-client').value}`, `# TYPE: ${document.getElementById('scope-type').value}`, ``, `## IN-SCOPE`];
  scopeIn.forEach(s => lines.push('+ ' + s));
  lines.push(`\n## OUT-OF-SCOPE`);
  scopeOut.forEach(s => lines.push('- ' + s));
  lines.push(`\n## RULES OF ENGAGEMENT\n${document.getElementById('scope-notes').value}`);
  dl(lines.join('\n'), 'text/plain', 'scope.txt');
  toast('Scope exported', 'ok');
}

function clearScope() { scopeIn = []; scopeOut = []; renderScope(); toast('Scope cleared', 'warn'); }

/* ══════════════════════════════════════════════
   DORK BUILDER
══════════════════════════════════════════════ */
function buildOpGrid() {
  const ops = ['site:','inurl:','intitle:','intext:','ext:','filetype:','cache:','OR','AND','-','\"\"','*','allintitle:','allinurl:','allintext:','AROUND(N)'];
  document.getElementById('op-grid').innerHTML = ops.map(op =>
    `<button class="op-btn" onclick="quickOp('${op}')">${op}</button>`
  ).join('');
}

function quickOp(op) {
  document.getElementById('bld-op').value = op;
  document.getElementById('bld-val').focus();
}

function appendOp() {
  const op  = document.getElementById('bld-op').value;
  const val = document.getElementById('bld-val').value.trim();
  builtParts.push(val ? op + val : op);
  document.getElementById('bld-val').value = '';
  previewBuild();
}

function previewBuild() {
  const val = document.getElementById('bld-val').value.trim();
  const op  = document.getElementById('bld-op').value;
  document.getElementById('bld-out').textContent = builtParts.join(' ') + (val ? ' ' + op + val : '') || '// build your query...';
}

function clearBuild() {
  builtParts = [];
  document.getElementById('bld-val').value = '';
  document.getElementById('bld-out').textContent = '// build your query...';
}

function launchBuilt() {
  const q = builtParts.join(' '); if (!q) return;
  window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank');
}

function launchBuiltBrowser() {
  const q = builtParts.join(' '); if (!q) { toast('Build a query first', 'warn'); return; }
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(q);
  showTab('browser', null);
  openBrowserTab(url, q.substring(0,20));
}

function copyBuilt() {
  navigator.clipboard?.writeText(builtParts.join(' '));
  toast('Query copied', 'ok');
}

function saveDork() {
  const q = builtParts.join(' ').trim(); if (!q) return;
  savedDorks.push({ q, ts: new Date().toISOString() });
  renderSavedDorks();
  clearBuild();
  toast('Dork saved', 'ok');
}

function renderSavedDorks() {
  const el = document.getElementById('saved-dorks-list');
  el.innerHTML = savedDorks.length
    ? savedDorks.map((sd,i) =>
        `<div class="saved-dork">
          <div class="sd-q">${sd.q}</div>
          <button class="btn bc" style="font-size:10px;padding:2px 6px" onclick="window.open('https://www.google.com/search?q='+encodeURIComponent(savedDorks[${i}].q),'_blank')">▶</button>
          <button class="sd-del" onclick="savedDorks.splice(${i},1);renderSavedDorks()">✗</button>
        </div>`
      ).join('')
    : '<div style="font-size:9px;color:var(--muted)">// no saved dorks yet</div>';
}

/* ══════════════════════════════════════════════
   REPORT FORGE
══════════════════════════════════════════════ */
function populateReportSess() {
  const rd = document.getElementById('rpt-sess'); if (!rd) return;
  rd.innerHTML = '<option value="">All findings</option>' + Object.values(sessions).map(s =>
    `<option value="${s.id}">${s.name}</option>`
  ).join('');
}

function genReport() {
  const title    = document.getElementById('rpt-title').value    || 'Recon Report';
  const analyst  = document.getElementById('rpt-analyst').value  || 'Unknown';
  const client   = document.getElementById('rpt-client').value   || 'Unknown';
  const cls      = document.getElementById('rpt-class').value;
  const incHits  = document.getElementById('rpt-inc-hits').checked;
  const incAll   = document.getElementById('rpt-inc-all').checked;
  const incScope = document.getElementById('rpt-inc-scope').checked;
  const sesId    = document.getElementById('rpt-sess').value;

  let out = `# ${title}\n**Classification:** ${cls}  \n**Client:** ${client}  \n**Analyst:** ${analyst}  \n**Date:** ${new Date().toISOString()}  \n**Tool:** LX-DORK PRO v2.0  \n\n---\n\n## Executive Summary\n\nThis report documents Google Dorking passive recon findings for ${client}. All testing performed on authorized targets using passive OSINT techniques only. Total dork database: ${D.length} dorks across ${Object.keys(CATS).length} categories.\n\n`;

  if (incScope && (scopeIn.length || scopeOut.length)) {
    out += `---\n\n## Scope\n\n### In-Scope\n`;
    scopeIn.forEach(s => out += `- \`${s}\`\n`);
    out += `\n### Out-of-Scope\n`;
    scopeOut.forEach(s => out += `- \`${s}\`\n`);
    out += `\n`;
  }

  const targetSessions = sesId ? [sessions[sesId]] : Object.values(sessions);
  if (targetSessions.length && targetSessions[0]) {
    out += `---\n\n## Campaign Findings\n\n`;
    targetSessions.forEach(sess => {
      if (!sess) return;
      out += `### Session: ${sess.name}\n**Target:** ${sess.target||'N/A'} | **Tester:** ${sess.tester||'N/A'} | **Engagement:** ${sess.eng||'N/A'}\n\n`;
      const hits = Object.entries(sess.dorks).filter(([,v]) => v.status === 'hit');
      const miss = Object.entries(sess.dorks).filter(([,v]) => v.status === 'miss');
      out += `| Metric | Count |\n|--------|-------|\n| ✅ Hits | ${hits.length} |\n| ❌ Misses | ${miss.length} |\n| Total | ${Object.keys(sess.dorks).length} |\n\n`;
      if (hits.length) {
        out += `#### 🔴 Hits\n\n`;
        hits.forEach(([name, data]) => {
          const d = D.find(x => x.n === name);
          out += `**${name}**\n`;
          if (d) out += `- Category: ${d.c}\n- Risk: ${d.r.toUpperCase()}\n- Query: \`${buildQStatic(d, sess.target)}\`\n- Desc: ${d.desc}\n`;
          if (data.note) out += `- **Notes:** ${data.note}\n`;
          out += `\n`;
        });
      }
      if (incAll && miss.length) { out += `#### Misses\n`; miss.forEach(([n]) => out += `- ${n}\n`); out += `\n`; }
    });
  }

  out += `---\n\n## Recommendations\n\n1. Review all HIT findings and validate manually.\n2. Remove exposed files and restrict directory listing.\n3. Rotate any credentials found in indexed files.\n4. Implement robots.txt and proper access controls.\n5. Conduct full authenticated assessment of identified panels.\n6. Apply WAF rules to block dork-based enumeration.\n7. Review cloud storage bucket permissions.\n8. Remove debug endpoints from production deployments.\n\n---\n\n*Generated by LX-DORK PRO v2.0 — Authorized Use Only*\n`;

  const el = document.getElementById('rpt-out');
  el.innerHTML = out
    .replace(/^# (.+)/gm,  '<span class="report-h"># $1</span>')
    .replace(/^## (.+)/gm, '<span class="report-h2">## $1</span>')
    .replace(/^### (.+)/gm,'<span class="report-y">### $1</span>')
    .replace(/\*\*(.+?)\*\*/g,'<span class="report-g">$1</span>')
    .replace(/`([^`]+)`/g, '<span class="report-c">`$1`</span>');
  toast('Report generated', 'ok');
}

function exportReport() {
  const content = document.getElementById('rpt-out').innerText;
  const title   = document.getElementById('rpt-title').value || 'report';
  dl(content, 'text/markdown', title.replace(/\s/g,'-') + '.md');
  toast('Report exported as Markdown', 'ok');
}

function exportReportJSON() {
  const data = {
    meta: {
      title:    document.getElementById('rpt-title').value,
      analyst:  document.getElementById('rpt-analyst').value,
      client:   document.getElementById('rpt-client').value,
      generated: new Date().toISOString(),
      tool: 'LX-DORK PRO v2.0'
    },
    scope: { in: scopeIn, out: scopeOut },
    sessions: sessions
  };
  dl(JSON.stringify(data, null, 2), 'application/json', 'lx-dork-report.json');
  toast('Report exported as JSON', 'ok');
}

function copyReport() {
  navigator.clipboard?.writeText(document.getElementById('rpt-out').innerText);
  toast('Report copied to clipboard', 'ok');
}

/* ══════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════ */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('on');
}

/* ══════════════════════════════════════════════
   GLOBAL KEY HANDLER
══════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.ctrlKey && e.key === 'a') { e.preventDefault(); selAll(); }
  if (e.ctrlKey && e.key === 'Enter') launchSelected();
});

/* ══════════════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);
