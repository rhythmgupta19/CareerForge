const mongoose = require('mongoose');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const DevOpsAssessment = require('../models/DevOpsAssessment');

const questionsData = {
  "Linux Basics": [
    {
      question: "Which directory in the Linux directory structure contains configuration files?",
      options: ["/var", "/etc", "/bin", "/usr"],
      correctAnswer: "/etc",
      explanation: "/etc contains host-specific system-wide configuration files."
    },
    {
      question: "What does the command 'ls -la' do?",
      options: ["List directory contents in a single column", "List all contents, including hidden files, with detailed info", "Delete files starting with l", "Create a new directory named la"],
      correctAnswer: "List all contents, including hidden files, with detailed info",
      explanation: "'-l' stands for long format (detailed info) and '-a' stands for all files (including hidden ones starting with a dot)."
    },
    {
      question: "Which permission string corresponds to the octal notation 755?",
      options: ["rwxrwxrwx", "rwxr-xr-x", "rw-r--r--", "rwx------"],
      correctAnswer: "rwxr-xr-x",
      explanation: "7 = rwx (owner), 5 = r-x (group), 5 = r-x (others)."
    },
    {
      question: "What is the primary function of the 'pwd' command?",
      options: ["Print working directory", "Change user password", "Create a new password", "Print host machine name"],
      correctAnswer: "Print working directory",
      explanation: "'pwd' prints the absolute path of the current working directory to standard output."
    },
    {
      question: "How do you view the last 10 lines of a file dynamically in real-time?",
      options: ["head -n 10 filename", "cat filename | tail", "tail -f filename", "less filename"],
      correctAnswer: "tail -f filename",
      explanation: "'tail -f' outputs the last part of a file and grows as the file changes dynamically."
    },
    {
      question: "Which command is used to change file ownership in Linux?",
      options: ["chmod", "chown", "chgrp", "umask"],
      correctAnswer: "chown",
      explanation: "'chown' stands for change owner and changes file/directory owner and group."
    },
    {
      question: "What is the difference between a hard link and a soft link (symbolic link)?",
      options: ["Hard links can cross file systems, soft links cannot", "Hard links share the same inode number, soft links point to the file path", "Deleting the original file breaks hard links but not soft links", "Soft links can only point to files, not directories"],
      correctAnswer: "Hard links share the same inode number, soft links point to the file path",
      explanation: "A hard link shares the inode (physical space), while a soft link is a shortcut pointing to the filename path."
    },
    {
      question: "Which of the following commands is used to search for a pattern within a text file?",
      options: ["find", "grep", "locate", "tar"],
      correctAnswer: "grep",
      explanation: "'grep' searches files for lines that match a regular expression pattern."
    },
    {
      question: "How do you create a recursive directory tree like 'deploy/src/assets' in one command?",
      options: ["mkdir deploy/src/assets", "mkdir -r deploy/src/assets", "mkdir -p deploy/src/assets", "mkdir -f deploy/src/assets"],
      correctAnswer: "mkdir -p deploy/src/assets",
      explanation: "The '-p' flag stands for parents and creates parent directories if they do not exist."
    },
    {
      question: "What does the command 'rm -rf /' signify, and why is it dangerous?",
      options: ["It reboots the system safely", "It removes files recursively and forcefully starting from root, deleting the entire system", "It updates all system repositories recursively", "It releases network sockets and resets firewalls"],
      correctAnswer: "It removes files recursively and forcefully starting from root, deleting the entire system",
      explanation: "'rm -rf /' attempts to recursively and forcefully delete all directories and files under root, leading to total data loss."
    }
  ],
  "User Management": [
    {
      question: "Which file contains the configuration definitions for users that have sudo privileges?",
      options: ["/etc/passwd", "/etc/shadow", "/etc/sudoers", "/etc/group"],
      correctAnswer: "/etc/sudoers",
      explanation: "/etc/sudoers lists the users and groups allowed to run commands via sudo."
    },
    {
      question: "Which command is used to add a new user to the system in a user-friendly, interactive way?",
      options: ["useradd", "adduser", "usermod", "newuser"],
      correctAnswer: "adduser",
      explanation: "'adduser' is a high-level perl wrapper script around useradd that sets up home directories, passwords, shell, etc. interactively."
    },
    {
      question: "What information is stored in the '/etc/shadow' file?",
      options: ["User home directory locations", "Encrypted user passwords", "Default shell configurations", "Logged in users activity history"],
      correctAnswer: "Encrypted user passwords",
      explanation: "/etc/shadow stores secure encrypted user password hashes and password aging information."
    },
    {
      question: "How do you add an existing user 'alice' to the secondary group 'docker' without removing other groups?",
      options: ["usermod -g docker alice", "usermod -a -G docker alice", "groupadd docker alice", "useradd -G docker alice"],
      correctAnswer: "usermod -a -G docker alice",
      explanation: "'-a' (append) and '-G' (secondary groups) adds the user to secondary groups while keeping existing memberships."
    },
    {
      question: "What does UID 0 signify in a Linux environment?",
      options: ["Disabled user", "Default guest user", "The root/superuser account", "System daemon process"],
      correctAnswer: "The root/superuser account",
      explanation: "UID (User ID) 0 is reserved exclusively for the root administrator."
    },
    {
      question: "Which command changes the shell of an existing user 'bob' to /bin/bash?",
      options: ["chsh -s /bin/bash bob", "usermod bob --shell /bin/bash", "passwd bob -s /bin/bash", "Both A and B"],
      correctAnswer: "Both A and B",
      explanation: "Both 'chsh -s' and 'usermod -s' change a user's default login shell."
    },
    {
      question: "Which file contains the list of local groups and group memberships?",
      options: ["/etc/passwd", "/etc/group", "/etc/services", "/etc/hosts"],
      correctAnswer: "/etc/group",
      explanation: "/etc/group contains local group names, GIDs, and user list memberships."
    },
    {
      question: "How do you lock a user account 'charlie' to prevent them from logging in?",
      options: ["userdel charlie", "usermod -L charlie", "passwd -d charlie", "usermod -U charlie"],
      correctAnswer: "usermod -L charlie",
      explanation: "usermod -L locks a user account's password hash, preventing log in."
    },
    {
      question: "What is the purpose of the 'su' command?",
      options: ["System upgrade", "Switch user / substitute user identity", "Show user status", "Superuser update"],
      correctAnswer: "Switch user / substitute user identity",
      explanation: "'su' allows you to run a shell under the credentials of another user, defaulting to root if none specified."
    },
    {
      question: "Which command deletes a user 'developer' along with their home directory and mail spool?",
      options: ["userdel developer", "userdel -r developer", "rmdir /home/developer", "userdel -f developer"],
      correctAnswer: "userdel -r developer",
      explanation: "The '-r' flag deletes the user's home directory and mail spool along with the user account."
    }
  ],
  "Networking Fundamentals": [
    {
      question: "Which layer of the OSI model handles logical IP addressing and routing?",
      options: ["Transport Layer", "Network Layer", "Data Link Layer", "Application Layer"],
      correctAnswer: "Network Layer",
      explanation: "The Network layer (Layer 3) handles routing, IP addressing, and packet forwarding."
    },
    {
      question: "What is the difference between TCP and UDP?",
      options: ["TCP is connectionless and fast, UDP is connection-oriented and reliable", "TCP is connection-oriented and reliable, UDP is connectionless and fast", "TCP operates at Layer 3, UDP operates at Layer 4", "TCP is only used for mail, UDP is used for web traffic"],
      correctAnswer: "TCP is connection-oriented and reliable, UDP is connectionless and fast",
      explanation: "TCP uses a three-way handshake to guarantee delivery (reliable), whereas UDP broadcasts packets without verifying delivery (faster, connectionless)."
    },
    {
      question: "How many IP addresses are available in a /24 subnet block?",
      options: ["256 total, 254 usable", "254 total, 254 usable", "128 total, 126 usable", "512 total, 510 usable"],
      correctAnswer: "256 total, 254 usable",
      explanation: "A /24 block contains 2^8 = 256 IPs. 2 are reserved: Network address (ends in .0) and Broadcast address (ends in .255)."
    },
    {
      question: "Which port is standard for SSH (Secure Shell) connections?",
      options: ["80", "22", "443", "8080"],
      correctAnswer: "22",
      explanation: "Port 22 is reserved for SSH traffic by default."
    },
    {
      question: "What is the purpose of the subnet mask?",
      options: ["Encrypts IP packet payloads", "Distinguishes the network portion of an IP address from the host portion", "Translates hostnames into IP addresses", "Allocates dynamic IP addresses automatically"],
      correctAnswer: "Distinguishes the network portion of an IP address from the host portion",
      explanation: "The subnet mask specifies which bits of the IP address represent the network prefix and which represent the host."
    },
    {
      question: "Which command utility traces the hops and route path packets take to a host?",
      options: ["ping", "netstat", "traceroute", "nslookup"],
      correctAnswer: "traceroute",
      explanation: "traceroute (or tracert in Windows) measures delays and hops from your host to a remote server."
    },
    {
      question: "What is NAT (Network Address Translation) used for?",
      options: ["Translating domain names into IP addresses", "Mapping private internal IP addresses to a public external IP address", "Assigning MAC addresses to network interfaces", "Encrypting database query requests"],
      correctAnswer: "Mapping private internal IP addresses to a public external IP address",
      explanation: "NAT enables multiple devices on a private local network to share a single public IP address to access the internet."
    },
    {
      question: "What operates at Layer 2 (Data Link) of the OSI model and routes traffic based on MAC addresses?",
      options: ["Router", "Network Switch", "Hub", "Gateway"],
      correctAnswer: "Network Switch",
      explanation: "Switches inspect incoming frame headers and forward them based on MAC address tables (Layer 2)."
    },
    {
      question: "Which port is used for secure HTTPS web traffic?",
      options: ["80", "8080", "443", "8443"],
      correctAnswer: "443",
      explanation: "HTTPS default port is 443. HTTP default port is 80."
    },
    {
      question: "What does a CIDR block of 10.0.0.0/16 signify?",
      options: ["A network with a subnet mask of 255.0.0.0", "A network with a subnet mask of 255.255.0.0", "A host with 16 network ports", "A subnet containing 16 total usable IP addresses"],
      correctAnswer: "A network with a subnet mask of 255.255.0.0",
      explanation: "/16 represents that the first 16 bits of the subnet mask are set to 1 (255.255.0.0)."
    }
  ],
  "DNS & HTTP": [
    {
      question: "Which DNS record type maps a domain name directly to an IPv4 address?",
      options: ["CNAME", "AAAA", "A", "TXT"],
      correctAnswer: "A",
      explanation: "'A' record maps a hostname to an IPv4 address. 'AAAA' is for IPv6."
    },
    {
      question: "What is a CNAME record in DNS?",
      options: ["Canonical Name record, used to alias one domain name to another", "Client Name record, used to log user activity", "Certifying Name record, used for SSL validation", "MX alternative for mail client lookups"],
      correctAnswer: "Canonical Name record, used to alias one domain name to another",
      explanation: "CNAME aliases a sub-domain (e.g. www.example.com) to a target domain name (e.g. example.com)."
    },
    {
      question: "What is the HTTP status code range for client-side errors?",
      options: ["2xx", "3xx", "4xx", "5xx"],
      correctAnswer: "4xx",
      explanation: "4xx errors (e.g., 404 Not Found, 401 Unauthorized, 403 Forbidden) represent client-side errors."
    },
    {
      question: "Which HTTP request method is designed to be idempotent and retrieve a resource without side effects?",
      options: ["POST", "GET", "PUT", "DELETE"],
      correctAnswer: "GET",
      explanation: "GET requests retrieve data and should not modify states or resources, making them safe and idempotent."
    },
    {
      question: "What does 'TTL' (Time to Live) signify in a DNS record configuration?",
      options: ["The duration a packet is allowed to hop in routers", "The duration DNS resolvers cache the record before querying authoritative servers again", "The expiration date of an SSL certificate", "The loading timeout limit of a web page"],
      correctAnswer: "The duration DNS resolvers cache the record before querying authoritative servers again",
      explanation: "TTL indicates how many seconds a DNS server can cache a query result locally before refreshing it."
    },
    {
      question: "During a TLS/SSL handshake, what is the role of a Certificate Authority (CA)?",
      options: ["To encrypt client browser cookies", "To cryptographically sign and verify the ownership of the website's public key", "To route server request queries", "To firewall unauthorized network ports"],
      correctAnswer: "To cryptographically sign and verify the ownership of the website's public key",
      explanation: "CAs act as trusted third parties that verify domain identities and sign their digital certificates."
    },
    {
      question: "Which HTTP header is mandatory in all HTTP/1.1 requests to specify the target domain name?",
      options: ["User-Agent", "Host", "Accept-Language", "Content-Type"],
      correctAnswer: "Host",
      explanation: "The 'Host' header is required in HTTP/1.1 to distinguish which virtual host on a server should handle the request."
    },
    {
      question: "What does the 502 Bad Gateway HTTP status code indicate?",
      options: ["The request resource was not found on the server", "The client is unauthorized to view the content", "An edge server or proxy received an invalid response from the upstream origin server", "The database connection pool timed out"],
      correctAnswer: "An edge server or proxy received an invalid response from the upstream origin server",
      explanation: "502 indicates a gateway or proxy server received an invalid response from the backend application node."
    },
    {
      question: "Which DNS query resolution stage follows the recursive resolver asking the Root Nameserver?",
      options: ["Querying the Authoritative Nameserver", "Querying the TLD (Top-Level Domain) Nameserver", "Checking local browser cache", "Returning the IP directly to the host"],
      correctAnswer: "Querying the TLD (Top-Level Domain) Nameserver",
      explanation: "The root server points the recursive resolver to the TLD (.com, .org) nameservers, which in turn point to authoritative nameservers."
    },
    {
      question: "What is the primary security benefit of HTTPS over HTTP?",
      options: ["HTTPS speeds up content loading via compression", "HTTPS encrypts the communication channel preventing eavesdropping and tampering", "HTTPS replaces traditional IP firewalls", "HTTPS isolates container processes"],
      correctAnswer: "HTTPS encrypts the communication channel preventing eavesdropping and tampering",
      explanation: "HTTPS uses TLS/SSL to encrypt traffic, protecting passwords, cookies, and payloads from man-in-the-middle attacks."
    }
  ],
  "Git Fundamentals": [
    {
      question: "What does 'git init' do?",
      options: ["Clones a remote repository to your local system", "Initializes a brand new, empty local Git repository in the current folder", "Prepares a commit message outline", "Authenticates user credentials against GitHub"],
      correctAnswer: "Initializes a brand new, empty local Git repository in the current folder",
      explanation: "'git init' creates a hidden '.git' folder to start tracking version history locally."
    },
    {
      question: "What is the purpose of the Git staging area (Index)?",
      options: ["It stores backup files in case of computer crashes", "It is a preview area to choose which modifications to include in the next commit", "It deploys code directly to production", "It is where remote branches are mirrored"],
      correctAnswer: "It is a preview area to choose which modifications to include in the next commit",
      explanation: "Files are added to the staging area with 'git add' before being committed via 'git commit'."
    },
    {
      question: "Which command shows the line-by-line differences of unstaged modifications in files?",
      options: ["git diff", "git status", "git log", "git show"],
      correctAnswer: "git diff",
      explanation: "'git diff' displays changes in your working directory that have not been staged yet."
    },
    {
      question: "What is a merge conflict in Git?",
      options: ["An authentication error against a remote git host", "When changes in different branches modify the same line of a file, and Git cannot automatically decide which to keep", "When commit messages do not follow correct styling guidelines", "When a file size exceeds the repository limits"],
      correctAnswer: "When changes in different branches modify the same line of a file, and Git cannot automatically decide which to keep",
      explanation: "If two branches edit the exact same lines, Git halts the merge and asks the developer to manually select the correct code."
    },
    {
      question: "What is the default merging strategy when the branch has no new commits since the fork point?",
      options: ["Three-way merge", "Rebase", "Fast-forward merge", "Squash merge"],
      correctAnswer: "Fast-forward merge",
      explanation: "In a fast-forward merge, Git simply moves the target branch pointer forward to the commit pointer without creating a merge commit."
    },
    {
      question: "Which command returns the commit history logs for the active branch?",
      options: ["git show", "git log", "git reflog", "git status"],
      correctAnswer: "git log",
      explanation: "'git log' lists the history of commits in reverse chronological order."
    },
    {
      question: "What does the command 'git commit -m \"msg\"' accomplish?",
      options: ["Pushes changes to GitHub", "Saves staging area modifications as a new commit snapshot in the local database", "Saves working directory modifications without adding them", "Creates a secondary backup branch"],
      correctAnswer: "Saves staging area modifications as a new commit snapshot in the local database",
      explanation: "'git commit' registers the staged snapshots into local history."
    },
    {
      question: "How do you discard all unstaged local changes in the working directory since the last commit?",
      options: ["git clean", "git checkout .", "git rm -rf", "git push --force"],
      correctAnswer: "git checkout .",
      explanation: "'git checkout .' restores files in the working directory to match the last commit or staging index."
    },
    {
      question: "What is the main difference between Distributed (DVCS) and Centralized (CVCS) Version Control?",
      options: ["DVCS doesn't support internet connections", "DVCS gives every developer a full copy of the entire history locally, whereas CVCS relies on a single central server", "CVCS is faster than DVCS for all branch operations", "DVCS only operates on Linux machines"],
      correctAnswer: "DVCS gives every developer a full copy of the entire history locally, whereas CVCS relies on a single central server",
      explanation: "Git is a DVCS, meaning cloning clones the entire version history database, enabling local execution of queries and commits."
    },
    {
      question: "What is the function of the '.gitignore' file?",
      options: ["It logs syntax errors in code files", "It lists files and folders Git should explicitly ignore and never track", "It disables write permissions on branches", "It specifies which users can clone the repository"],
      correctAnswer: "It lists files and folders Git should explicitly ignore and never track",
      explanation: "Files matching patterns in .gitignore (e.g. node_modules, secrets, log files) are not added to version control."
    }
  ],
  "GitHub Workflows": [
    {
      question: "What is a Pull Request (PR) on GitHub?",
      options: ["A command to pull latest updates from local repository", "A proposed set of code changes submitted by a developer to be reviewed and merged into a branch", "An API call requesting private user profile data", "A request to restrict access to a repository"],
      correctAnswer: "A proposed set of code changes submitted by a developer to be reviewed and merged into a branch",
      explanation: "PRs facilitate code review, discussions, testing, and continuous integration checks before changes are merged."
    },
    {
      question: "What is the key difference between 'git fetch' and 'git pull'?",
      options: ["git fetch merges code automatically, git pull only downloads changes", "git fetch only downloads metadata and updates remote tracking branches, git pull downloads and immediately merges changes into the local branch", "git fetch is used for public repos, git pull for private ones", "There is no difference between them"],
      correctAnswer: "git fetch only downloads metadata and updates remote tracking branches, git pull downloads and immediately merges changes into the local branch",
      explanation: "'git pull' is essentially a combination of 'git fetch' followed by 'git merge'."
    },
    {
      question: "What is the benefit of using 'git rebase' instead of 'git merge'?",
      options: ["Rebase is faster to execute", "Rebase creates a clean, linear commit history by moving commits to the tip of the target branch, avoiding merge commits", "Rebase automatically resolves conflicts without human input", "Rebase pushes changes directly to master"],
      correctAnswer: "Rebase creates a clean, linear commit history by moving commits to the tip of the target branch, avoiding merge commits",
      explanation: "Rebase rewrites commits sequentially onto the target branch, maintaining a flat linear timeline."
    },
    {
      question: "How do you specify a remote repository URL named 'origin' for your local Git repository?",
      options: ["git remote add origin <URL>", "git remote set-url <URL>", "git clone origin <URL>", "git remote origin --link <URL>"],
      correctAnswer: "git remote add origin <URL>",
      explanation: "'git remote add <name> <url>' links local git history with a remote target host repository."
    },
    {
      question: "What is a GitHub Fork?",
      options: ["A direct clone of a repository to your local computer", "A personal copy of someone else's GitHub repository hosted on your own GitHub account", "A command that deletes master branches", "An automated security scanner for packages"],
      correctAnswer: "A personal copy of someone else's GitHub repository hosted on your own GitHub account",
      explanation: "Forks allow developers to make changes to projects freely without modifying the original repository directly."
    },
    {
      question: "What is a Branch Protection Rule on GitHub used for?",
      options: ["Encrypting source code files on GitHub servers", "Restricting direct pushes, requiring reviews, and mandating status checks before merging", "Preventing external users from cloning the repository", "Limiting the number of branches a user can create"],
      correctAnswer: "Restricting direct pushes, requiring reviews, and mandating status checks before merging",
      explanation: "Branch protection secures sensitive branches (like main or production) from accidental or unreviewed modifications."
    },
    {
      question: "What does a Squash Merge do when merging a Pull Request?",
      options: ["Deletes the target branch files completely", "Combines all commits from the feature branch into a single clean commit on the target branch", "Compresses file sizes on disk", "Cancels ongoing pipeline actions"],
      correctAnswer: "Combines all commits from the feature branch into a single clean commit on the target branch",
      explanation: "Squash merges hide granular feature commits and maintain a neat, high-level history on the main branch."
    },
    {
      question: "Which command pushes local commits on branch 'feature' to remote host 'origin'?",
      options: ["git push origin feature", "git push feature origin", "git remote push feature", "git commit -p origin feature"],
      correctAnswer: "git push origin feature",
      explanation: "Syntax: git push <remote-name> <branch-name>."
    },
    {
      question: "How can you link your commit to a specific GitHub issue so it closes automatically?",
      options: ["Write the issue number in comments", "Include a keyword like 'closes #12' or 'fixes #12' in the commit message", "Use git tag", "GitHub does not support issue auto-closing"],
      correctAnswer: "Include a keyword like 'closes #12' or 'fixes #12' in the commit message",
      explanation: "GitHub parses commit messages for keywords like fixes, closes, resolves followed by the issue number and automates closing upon merge."
    },
    {
      question: "What is Git Reflog used for?",
      options: ["Listing repository branches on remote", "Tracking every time local branch tips are updated, allowing recovery of deleted commits or resets", "Logging server request speeds", "A formatting checker for scripts"],
      correctAnswer: "Tracking every time local branch tips are updated, allowing recovery of deleted commits or resets",
      explanation: "Reflog records local commits, checkouts, and resets, serving as a safety net to restore 'lost' commits."
    }
  ],
  "Bash Scripting Basics": [
    {
      question: "What does the shebang '#!/bin/bash' at the top of a script specify?",
      options: ["It is a comment describing the script author", "It defines the interpreter pathway to execute the script", "It configures shell history limitations", "It runs the script in debug mode"],
      correctAnswer: "It defines the interpreter pathway to execute the script",
      explanation: "The shebang tells the operating system to execute the script using the Bash shell interpreter located at /bin/bash."
    },
    {
      question: "How do you declare a variable named 'PORT' with the value 8080 without spaces in Bash?",
      options: ["PORT = 8080", "PORT=8080", "set PORT 8080", "$PORT=8080"],
      correctAnswer: "PORT=8080",
      explanation: "In Bash, variable assignment must have NO spaces around the '=' character. Space triggers command parsing errors."
    },
    {
      question: "How do you access the value of the variable 'PORT' in Bash?",
      options: ["PORT", "get(PORT)", "$PORT", "val PORT"],
      correctAnswer: "$PORT",
      explanation: "The '$' prefix is used to expand and evaluate variables in shell scripts."
    },
    {
      question: "What do the positional parameters '$1' and '$2' represent in a Bash script?",
      options: ["Line numbers inside the script", "The first and second command-line arguments passed to the script", "The exit codes of previous processes", "Piped input streams"],
      correctAnswer: "The first and second command-line arguments passed to the script",
      explanation: "$1, $2, etc. correspond to arguments passed (e.g. './script.sh arg1 arg2')."
    },
    {
      question: "What parameter variable holds the total number of command-line arguments passed to a script?",
      options: ["$?", "$#", "$*", "$$"],
      correctAnswer: "$#",
      explanation: "$# returns the count of positional parameters passed to the active execution scope."
    },
    {
      question: "How do you check if a file named 'config.json' exists in a Bash conditional statement?",
      options: ["if [ -d 'config.json' ]", "if [ -f 'config.json' ]", "if [ -e 'config.json' ]", "Both B and C"],
      correctAnswer: "Both B and C",
      explanation: "'-e' checks if file/directory exists, and '-f' checks specifically if it exists and is a regular file."
    },
    {
      question: "What does the exit code 0 signify when a script or command finishes?",
      options: ["Execution failure", "Successful completion with no errors", "Syntax error in block", "Infinite loop warning"],
      correctAnswer: "Successful completion with no errors",
      explanation: "In Unix systems, exit code 0 represents success. Any non-zero code (1-255) indicates an error status."
    },
    {
      question: "How do you read keyboard input from a user into a variable named 'USER_NAME' in Bash?",
      options: ["input USER_NAME", "read USER_NAME", "USER_NAME = read()", "get USER_NAME"],
      correctAnswer: "read USER_NAME",
      explanation: "The 'read' command reads a line from standard input and assigns it to variables."
    },
    {
      question: "What is the correct syntax to evaluate arithmetic expressions like 5 + 3 in Bash?",
      options: ["$((5 + 3))", "expr 5 + 3", "$[5 + 3]", "All of the above"],
      correctAnswer: "All of the above",
      explanation: "$((expression)), $[expression], and 'expr' utility are all valid ways to evaluate arithmetic in Bash."
    },
    {
      question: "How do you output the string 'Success' to the console only if the previous command succeeded?",
      options: ["command || echo 'Success'", "command && echo 'Success'", "command ; echo 'Success'", "command | echo 'Success'"],
      correctAnswer: "command && echo 'Success'",
      explanation: "The '&&' operator executes the following command only if the preceding command returns an exit status of 0."
    }
  ],
  "Automating Tasks": [
    {
      question: "What does the cron syntax '0 5 * * 1' represent?",
      options: ["Every 5 minutes on Monday", "At 5:00 AM every Monday", "At 5:00 AM on the 1st of every month", "At midnight every 5 days"],
      correctAnswer: "At 5:00 AM every Monday",
      explanation: "Fields: minute (0), hour (5), day of month (*), month (*), day of week (1 = Monday)."
    },
    {
      question: "Which command is used to edit the cron jobs schedule file for the current user?",
      options: ["crontab -l", "crontab -e", "crontab -r", "vi /etc/crontab"],
      correctAnswer: "crontab -e",
      explanation: "'-e' opens the user-specific cron configuration table in the system default text editor."
    },
    {
      question: "How do you list all active cron jobs for the current user?",
      options: ["crontab -e", "crontab -l", "crontab -s", "ps aux | grep cron"],
      correctAnswer: "crontab -l",
      explanation: "'-l' stands for list and outputs all scheduled cron jobs of the current user."
    },
    {
      question: "What is the purpose of the 'logrotate' utility?",
      options: ["Rotating screen orientations in desktop Linux", "Compressing, archiving, and removing system log files periodically to save disk space", "Scanning processes for memory leaks", "Balancing database access loads"],
      correctAnswer: "Compressing, archiving, and removing system log files periodically to save disk space",
      explanation: "logrotate automates log management, compressing and pruning files based on age or size."
    },
    {
      question: "Which command runs a script in the background and keeps it running even after you close the terminal?",
      options: ["bash script.sh &", "nohup ./script.sh &", "bg ./script.sh", "disown ./script.sh"],
      correctAnswer: "nohup ./script.sh &",
      explanation: "'nohup' (no hangup) runs a command immune to hangups, sending outputs to a file, and '&' background-executes it."
    },
    {
      question: "How do you schedule a one-off automated task to run once at 2:00 PM tomorrow?",
      options: ["Using cron", "Using at command ('at 2pm tomorrow')", "Using systemd timer", "Using batch command"],
      correctAnswer: "Using at command ('at 2pm tomorrow')",
      explanation: "The 'at' command is designed for scheduling one-off tasks at a specific time, unlike cron which is for recurring tasks."
    },
    {
      question: "What does the redirection '2>&1' signify in a command line execution?",
      options: ["Send stdout to standard error", "Combine standard error (stderr, file descriptor 2) into standard output (stdout, file descriptor 1)", "Overwrite the contents of file 2 with file 1", "Run two commands in parallel"],
      correctAnswer: "Combine standard error (stderr, file descriptor 2) into standard output (stdout, file descriptor 1)",
      explanation: "2 represents stderr, and '&1' points to stdout. It redirects error streams into the output stream for consolidated logging."
    },
    {
      question: "What is the role of a systemd service file?",
      options: ["To format terminal outputs", "To define how the OS starts, monitors, and stops background system processes/daemons", "To install software updates", "To manage system network interface adapters"],
      correctAnswer: "To define how the OS starts, monitors, and stops background system processes/daemons",
      explanation: "Systemd service files (.service) declare dependencies, paths, restart parameters, and user permissions for background services."
    },
    {
      question: "How do you redirect standard output of a command to append to a file without overwriting it?",
      options: ["command > filename", "command >> filename", "command 2> filename", "command | filename"],
      correctAnswer: "command >> filename",
      explanation: "'>' overwrites a file's contents, while '>>' appends standard output to the end of the file."
    },
    {
      question: "What is the default destination for output streams in cron executions if not redirected?",
      options: ["Sent to the system console", "Sent via local email to the cron owner account", "Discarded automatically into /dev/null", "Appended to syslog"],
      correctAnswer: "Sent via local email to the cron owner account",
      explanation: "Cron sends any uncaptured stdout or stderr output to the local mailbox of the user running the cron task."
    }
  ],
  "Docker Containers": [
    {
      question: "What is the key architecture difference between virtual machines (VMs) and Docker containers?",
      options: ["Containers run guest operating systems, VMs do not", "VMs virtualize hardware and run entire guest OS, containers share the host kernel and isolate processes", "Containers are heavier than VMs", "VMs only run on cloud providers"],
      correctAnswer: "VMs virtualize hardware and run entire guest OS, containers share the host kernel and isolate processes",
      explanation: "Containers are lightweight because they share the host operating system's kernel, while VMs instantiate independent virtualized hardware and full operating systems."
    },
    {
      question: "Which Dockerfile instruction defines the parent image to build the container from?",
      options: ["RUN", "COPY", "FROM", "WORKDIR"],
      correctAnswer: "FROM",
      explanation: "'FROM' specifies the base image (e.g. alpine, node:18) from which the build begins."
    },
    {
      question: "What is the purpose of multi-stage Docker builds?",
      options: ["To deploy containers to multiple clouds simultaneously", "To reduce final image size by separating compilation tools from the runtime environment", "To compile code faster using multiple CPUs", "To encrypt container filesystems"],
      correctAnswer: "To reduce final image size by separating compilation tools from the runtime environment",
      explanation: "Multi-stage builds allow you to use large developer images to compile binaries and copy only the build artifacts to lightweight runtime images."
    },
    {
      question: "Which command builds a Docker image from a Dockerfile in the current directory, tagging it 'webapp:1.0'?",
      options: ["docker build webapp:1.0 .", "docker build -t webapp:1.0 .", "docker run -t webapp:1.0 .", "docker tag webapp:1.0 ."],
      correctAnswer: "docker build -t webapp:1.0 .",
      explanation: "'-t' stands for tag and assigns a name and version to the output image. The '.' specifies the build context directory."
    },
    {
      question: "How do you run a container in detached background mode mapping host port 80 to container port 3000?",
      options: ["docker run -p 3000:80 webapp", "docker run -d -p 80:3000 webapp", "docker run -d -m 80:3000 webapp", "docker run --port 80:3000 webapp"],
      correctAnswer: "docker run -d -p 80:3000 webapp",
      explanation: "'-d' runs the container in the background (detached), and '-p 80:3000' routes host port 80 to container port 3000."
    },
    {
      question: "What is the primary purpose of a Docker Volume?",
      options: ["Increasing network bandwidth limits", "Persisting data generated by a container beyond its lifecycle on the host machine", "Compressing image layer counts", "Monitoring container CPU usage"],
      correctAnswer: "Persisting data generated by a container beyond its lifecycle on the host machine",
      explanation: "Volumes decouple state and data storage from container lifecycles, ensuring database contents remain intact when containers reboot or delete."
    },
    {
      question: "Which Docker network driver isolates containers on a single host, allowing them to communicate via IP address?",
      options: ["host", "none", "bridge", "overlay"],
      correctAnswer: "bridge",
      explanation: "The default 'bridge' network connects containers running on the same host, enabling private routing between them."
    },
    {
      question: "What does the 'CMD' instruction in a Dockerfile define?",
      options: ["Commands that run during the image build stage", "The default executable command that runs when a container starts", "Environment configurations", "Dependencies list"],
      correctAnswer: "The default executable command that runs when a container starts",
      explanation: "'CMD' sets the entry executable and arguments of the running container. It can be overridden at runtime."
    },
    {
      question: "How do you inspect the runtime output logs of a container named 'api-server'?",
      options: ["docker inspect api-server", "docker logs api-server", "docker history api-server", "docker cat api-server"],
      correctAnswer: "docker logs api-server",
      explanation: "'docker logs' retrieves the standard output and error streams generated by the target container processes."
    },
    {
      question: "Which command stops and removes all active containers in a single shell pipeline?",
      options: ["docker system prune", "docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)", "docker delete --all", "docker kill -f"],
      correctAnswer: "docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)",
      explanation: "'docker ps -a -q' returns active and exited container IDs, which are passed to stop and rm commands sequentially."
    }
  ],
  "Docker Compose": [
    {
      question: "What is the default filename of the configuration file used by Docker Compose?",
      options: ["docker.config", "compose.config", "docker-compose.yml", "docker-compose.json"],
      correctAnswer: "docker-compose.yml",
      explanation: "Compose configurations are declared in a YAML format file named docker-compose.yml by default."
    },
    {
      question: "Which command starts all services defined in the compose file in detached background mode?",
      options: ["docker-compose start -d", "docker-compose up -d", "docker-compose build -d", "docker-compose run -d"],
      correctAnswer: "docker-compose up -d",
      explanation: "'docker-compose up' builds, creates, starts, and attaches to containers for a service. '-d' detaches processes to the background."
    },
    {
      question: "How do you tear down, stop, and delete all containers, networks, and volumes defined in a compose file?",
      options: ["docker-compose stop", "docker-compose down", "docker-compose down --volumes", "Both B and C"],
      correctAnswer: "Both B and C",
      explanation: "'docker-compose down' stops and removes containers and networks. Adding '--volumes' (or '-v') also prunes persistent volumes."
    },
    {
      question: "What is the purpose of the 'depends_on' key in docker-compose.yml?",
      options: ["It defines CPU share percentages", "It specifies the boot-up and shutdown dependency order between services", "It exposes ports to the router", "It defines environment secrets locations"],
      correctAnswer: "It specifies the boot-up and shutdown dependency order between services",
      explanation: "'depends_on' ensures target database or queue services start before dependency web applications boot up."
    },
    {
      question: "By default, how does Docker Compose isolate services defined in a single configuration file?",
      options: ["Assigning individual host ports", "Creating a dedicated default bridge network for all service containers in the project", "By running them on separate servers", "Encrypting communication between containers"],
      correctAnswer: "Creating a dedicated default bridge network for all service containers in the project",
      explanation: "Compose sets up a single network for your app by default. Each container joins the network and can resolve other services by container name."
    },
    {
      question: "How can you specify environment variables inside docker-compose.yml?",
      options: ["Using the 'environment:' list key", "Providing an '.env' file in the directory", "Using the 'env_file:' directive", "All of the above"],
      correctAnswer: "All of the above",
      explanation: "Compose supports inline environment variables, environment files list, and auto-loading a local .env file."
    },
    {
      question: "Which command displays the current execution logs from all running compose services?",
      options: ["docker-compose ps", "docker-compose logs", "docker-compose logs -f", "Both B and C"],
      correctAnswer: "Both B and C",
      explanation: "'docker-compose logs' prints logs, and '-f' follows the stream in real-time."
    },
    {
      question: "How do you scale a service named 'web' to run 3 instances using Docker Compose?",
      options: ["docker-compose scale web=3", "docker-compose up --scale web=3", "docker-compose run web --instances 3", "Both A and B"],
      correctAnswer: "Both A and B",
      explanation: "Both 'docker-compose scale' and 'docker-compose up --scale' are valid instructions to scale container replication."
    },
    {
      question: "What is the purpose of a named volume in docker-compose.yml?",
      options: ["To set memory allocations", "To declare a persistent volume path that can be shared across multiple service containers", "To backup image layers", "To expose static web folders to local host"],
      correctAnswer: "To declare a persistent volume path that can be shared across multiple service containers",
      explanation: "Named volumes declared under the root 'volumes:' key can be mounted into different service container paths to share persistent states."
    },
    {
      question: "What does the command 'docker-compose ps' display?",
      options: ["Host processes running docker services", "The current lifecycle states and port mappings of containers managed by the compose project", "Average database response latency metrics", "A list of build configurations"],
      correctAnswer: "The current lifecycle states and port mappings of containers managed by the compose project",
      explanation: "'docker-compose ps' lists container status details (running, exited, ports) in tabular format."
    }
  ],
  "Kubernetes Architecture": [
    {
      question: "Which component of the Kubernetes Control Plane acts as the primary datastore and source of truth?",
      options: ["kube-apiserver", "etcd", "kube-scheduler", "kube-controller-manager"],
      correctAnswer: "etcd",
      explanation: "etcd is a highly available, consistent key-value store used to persist all cluster configurations and states."
    },
    {
      question: "What is the primary role of the 'kube-scheduler'?",
      options: ["Maintaining replication state numbers", "Assigning newly created pods to healthy worker nodes based on resource constraints", "Routing services traffic", "Managing network firewalls"],
      correctAnswer: "Assigning newly created pods to healthy worker nodes based on resource constraints",
      explanation: "The scheduler monitors pods without nodes and selects the most compatible node to run them on."
    },
    {
      question: "Which component runs on worker nodes to monitor container health and communicate with the API server?",
      options: ["kube-proxy", "kubelet", "etcd", "containerd"],
      correctAnswer: "kubelet",
      explanation: "The kubelet is the node agent that ensures containers defined in PodSpecs are running and healthy on the physical machine."
    },
    {
      question: "What is a Kubernetes Pod?",
      options: ["A physical VM in the cloud", "The smallest deployable unit in Kubernetes, wrapping one or more tightly coupled containers", "A network routing rule", "A code compilation pipeline"],
      correctAnswer: "The smallest deployable unit in Kubernetes, wrapping one or more tightly coupled containers",
      explanation: "Pods encapsulate containers, storage, unique network IPs, and execution options sharing the same host context."
    },
    {
      question: "Which worker node component manages local network routing and handles load balancing for traffic targeting Services?",
      options: ["kube-scheduler", "kube-proxy", "kubelet", "CoreDNS"],
      correctAnswer: "kube-proxy",
      explanation: "kube-proxy maintains network rules on host nodes, routing and load-balancing connection requests targeting internal Services."
    },
    {
      question: "What is the controller responsible for matching the actual number of running pods to a declared replica count?",
      options: ["ReplicaSet controller", "Node controller", "Endpoints controller", "Namespace controller"],
      correctAnswer: "ReplicaSet controller",
      explanation: "ReplicaSets reconcile states, adding or pruning pods to match desired replication volumes declared in configurations."
    },
    {
      question: "Which Control Plane component exposes the REST API interface and serves as the entryway for all kubectl commands?",
      options: ["kube-controller-manager", "etcd", "kube-apiserver", "kube-scheduler"],
      correctAnswer: "kube-apiserver",
      explanation: "The API server validates and configures data for state objects, updating etcd configurations securely."
    },
    {
      question: "What is a declarative approach in Kubernetes?",
      options: ["Running kubectl commands to create resources directly (imperative)", "Submitting a YAML manifest describing the desired state of resources, allowing controllers to reconcile states automatically", "Using script workflows to reboot VMs", "Configuring firewalls manually"],
      correctAnswer: "Submitting a YAML manifest describing the desired state of resources, allowing controllers to reconcile states automatically",
      explanation: "Declarative configurations define 'what' the state should look like, and Kubernetes works autonomously to align actual states with the declaration."
    },
    {
      question: "What operates inside a node to execute container runtimes, like container instantiation?",
      options: ["Kube-proxy", "Container Runtime (e.g. containerd, CRI-O)", "Etcd client", "Hypervisor"],
      correctAnswer: "Container Runtime (e.g. containerd, CRI-O)",
      explanation: "The container runtime pulls images, instantiates namespaces, and executes process constraints defined by container standards."
    },
    {
      question: "What is a Kubernetes Namespace used for?",
      options: ["Limiting internet network access", "Logically isolating groups of resources within a single physical cluster", "Specifying host domain mappings", "Configuring physical storage hardware mounts"],
      correctAnswer: "Logically isolating groups of resources within a single physical cluster",
      explanation: "Namespaces partition clusters into virtual workspaces, preventing naming collisions and supporting access controls."
    }
  ],
  "Managing K8s Clusters": [
    {
      question: "Which kubectl command is used to apply a declarative configuration file to a cluster?",
      options: ["kubectl run", "kubectl create", "kubectl apply", "kubectl deploy"],
      correctAnswer: "kubectl apply",
      explanation: "kubectl apply -f <filename.yaml> creates or updates resources declaration dynamically."
    },
    {
      question: "How do you scale a deployment named 'api-service' to run 5 replicas?",
      options: ["kubectl scale deployment api-service --replicas=5", "kubectl replicas deployment api-service 5", "kubectl update api-service --scale=5", "kubectl edit --replicas=5 api-service"],
      correctAnswer: "kubectl scale deployment api-service --replicas=5",
      explanation: "'kubectl scale' dynamically updates deployment configurations to the target replica count."
    },
    {
      question: "Which resource is used to store sensitive data like passwords or API keys securely in Kubernetes?",
      options: ["ConfigMap", "Secret", "PersistentVolume", "ServiceAccount"],
      correctAnswer: "Secret",
      explanation: "Secrets store sensitive credentials (encoded in base64), isolating credentials from deployment files."
    },
    {
      question: "What is a Kubernetes Service?",
      options: ["A background server daemon process", "An abstraction that defines a logical set of Pods and a policy to access them (with static IP and DNS name)", "A cloud load balancer setup script", "A system process that checks CPU loads"],
      correctAnswer: "An abstraction that defines a logical set of Pods and a policy to access them (with static IP and DNS name)",
      explanation: "Services provide stable networking targets and endpoints since individual pods are ephemeral and shift IPs frequently."
    },
    {
      question: "What is the difference between PersistentVolume (PV) and PersistentVolumeClaim (PVC)?",
      options: ["PV is storage allocated by administrators; PVC is a request for storage by a developer/pod", "PV is database storage; PVC is file storage", "PV is cloud-hosted; PVC is local-host only", "PVC is storage allocated; PV is request"],
      correctAnswer: "PV is storage allocated by administrators; PVC is a request for storage by a developer/pod",
      explanation: "PVs represent physical cluster resources (like S3 or EBS volume blocks), while PVCs consume those resources by binding targets to pods."
    },
    {
      question: "Which command shows the detailed status and lifecycle event logs of a pod named 'auth-pod'?",
      options: ["kubectl logs auth-pod", "kubectl describe pod auth-pod", "kubectl inspect auth-pod", "kubectl get pod auth-pod"],
      correctAnswer: "kubectl describe pod auth-pod",
      explanation: "'describe' outputs full specifications and a chronological list of recent lifecycle event triggers (e.g. Pulling, Failed, Scheduled)."
    },
    {
      question: "What is an Ingress in Kubernetes?",
      options: ["A local command-line database", "An API object that manages external access to services, typically HTTP/HTTPS, providing routing rules and load balancing", "A tool to compile container images inside nodes", "A cloud security group rules template"],
      correctAnswer: "An API object that manages external access to services, typically HTTP/HTTPS, providing routing rules and load balancing",
      explanation: "Ingress serves as an entry gateway that routes external traffic to internal services based on domain paths."
    },
    {
      question: "Which probe checks if a container is alive and determines if it should be restarted?",
      options: ["Readiness probe", "Liveness probe", "Startup probe", "Connectivity probe"],
      correctAnswer: "Liveness probe",
      explanation: "Liveness probes check process health. If checks fail, kubelet deletes the pod and instantiates a replacement replica."
    },
    {
      question: "What is Helm in the context of Kubernetes?",
      options: ["A monitoring dashboard tool", "A package manager for Kubernetes that templates and packages YAML manifests as charts", "A CLI tool to install worker nodes", "A container runtime engine"],
      correctAnswer: "A package manager for Kubernetes that templates and packages YAML manifests as charts",
      explanation: "Helm packages related resource files as Charts, automating configurations, dependency resolutions, and cluster releases."
    },
    {
      question: "Which service type exposes the service on a static port on each Node's IP address, allowing external access?",
      options: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"],
      correctAnswer: "NodePort",
      explanation: "NodePort exposes services externally by routing traffic on a high port range (30000-32767) of all physical cluster nodes."
    }
  ],
  "CI/CD Concepts": [
    {
      question: "What is the primary goal of Continuous Integration (CI)?",
      options: ["Deploying code directly to client databases", "Frequently merging code changes into a central repository, triggering automated builds and tests to catch bugs early", "Monitoring server speeds dynamically", "Writing script templates for testing"],
      correctAnswer: "Frequently merging code changes into a central repository, triggering automated builds and tests to catch bugs early",
      explanation: "CI validates integrations via automated compiles and unit tests to ensure main codebase branches remain stable."
    },
    {
      question: "What is the key difference between Continuous Delivery and Continuous Deployment?",
      options: ["Delivery is automated, Deployment is manual", "Continuous Delivery keeps code ready for release but requires manual approval to deploy; Continuous Deployment automates release directly to production without human intervention", "Delivery operates on databases, Deployment on source code", "There is no difference between them"],
      correctAnswer: "Continuous Delivery keeps code ready for release but requires manual approval to deploy; Continuous Deployment automates release directly to production without human intervention",
      explanation: "Continuous Delivery stops before production, prompting a manual release trigger. Continuous Deployment automates all stages from push to live."
    },
    {
      question: "What is a pipeline in CI/CD context?",
      options: ["A network connection routing database calls", "A sequence of automated steps (build, test, deploy) that code changes travel through from commit to production", "A Git branch structure", "A load balancer configuration"],
      correctAnswer: "A sequence of automated steps (build, test, deploy) that code changes travel through from commit to production",
      explanation: "Pipelines define the automated workflow (linting, compiling, testing, containerizing, and shipping) of code."
    },
    {
      question: "Which deployment strategy routes a small percentage of traffic to a new version of the application to test stability, before fully rolling it out?",
      options: ["Blue-Green Deployment", "Canary Deployment", "Recreated Deployment", "Rolling Update"],
      correctAnswer: "Canary Deployment",
      explanation: "Canary releases redirect a fraction of production traffic to new builds. If error rates remain low, traffic is gradually fully shifted."
    },
    {
      question: "What is Blue-Green Deployment?",
      options: ["Testing software in winter vs summer", "Running two identical environments (Blue is active, Green is stage), swapping routing instantly once Green tests pass", "A coding style guide format", "A load balancer algorithm"],
      correctAnswer: "Running two identical environments (Blue is active, Green is stage), swapping routing instantly once Green tests pass",
      explanation: "Blue-Green minimizes downtime and risks by staging updates in an isolated target environment before switching DNS/traffic targets."
    },
    {
      question: "What is Trunk-Based Development?",
      options: ["Creating long-lived feature branches", "Developers merge small, frequent updates into a single central branch ('trunk'), avoiding complex merge conflicts", "Developing software on main servers directly", "A strategy that does not use version control"],
      correctAnswer: "Developers merge small, frequent updates into a single central branch ('trunk'), avoiding complex merge conflicts",
      explanation: "Trunk-based development reduces merge conflicts and keeps integrations tight by avoiding long-lived branches."
    },
    {
      question: "What is the purpose of an Artifact Repository (e.g. Nexus, Artifactory) in CI/CD?",
      options: ["Storing developer credentials", "Storing and managing build outputs (binaries, library packages, container images) generated by pipelines", "Encrypting database queries", "Hosting HTML files"],
      correctAnswer: "Storing and managing build outputs (binaries, library packages, container images) generated by pipelines",
      explanation: "Artifact repositories store versioned outputs (like jar files or docker images) to ensure deployments pull audited sources."
    },
    {
      question: "What is a Quality Gate in a CI/CD pipeline?",
      options: ["A lock on physical server cages", "A set of threshold conditions (like code coverage, security scan issues) that a build must satisfy to proceed", "An automated code generator", "A feedback rating form"],
      correctAnswer: "A set of threshold conditions (like code coverage, security scan issues) that a build must satisfy to proceed",
      explanation: "Quality gates fail pipelines if code analysis (e.g. SonarQube) discovers security leaks, bugs, or low test coverage."
    },
    {
      question: "Why is automated security scanning (SAST/DAST) integrated into CI/CD pipelines?",
      options: ["To speed up build compilations", "To identify vulnerabilities in dependency packages and application source code automatically during builds", "To block IP addresses", "To configure cloud firewall rules"],
      correctAnswer: "To identify vulnerabilities in dependency packages and application source code automatically during builds",
      explanation: "Security scanning automates vulnerability auditing, catching flaws before code is compiled into images."
    },
    {
      question: "What does idempotency mean in the context of automated deployment?",
      options: ["The deployment pipeline fails randomly", "Repeatedly executing the deployment script results in the same target environment state without causing errors or duplicate resources", "Deployments compile files differently every time", "Access credentials change after every deploy"],
      correctAnswer: "Repeatedly executing the deployment script results in the same target environment state without causing errors or duplicate resources",
      explanation: "An idempotent script verifies existing conditions, creating resources only if they are missing or differ from specifications, ensuring stability."
    }
  ],
  "GitHub Actions": [
    {
      question: "Where must GitHub Actions workflow configuration files be located in a repository?",
      options: ["/scripts", "/.github/workflows/", "/config", "/actions"],
      correctAnswer: "/.github/workflows/",
      explanation: "GitHub Action parser searches for YAML files in the '.github/workflows/' directory."
    },
    {
      question: "What trigger event runs a workflow when code is merged or pushed to a repository?",
      options: ["on: pull_request", "on: push", "on: merge", "on: commit"],
      correctAnswer: "on: push",
      explanation: "'on: push' triggers execution whenever commits are pushed to branches."
    },
    {
      question: "What is a GitHub Actions Runner?",
      options: ["A developer who merges code", "The execution machine or server host that runs the steps defined in the workflow job", "An API router", "A script that formats code"],
      correctAnswer: "The execution machine or server host that runs the steps defined in the workflow job",
      explanation: "Runners listen for jobs, execute step actions sequentially, and report results back to GitHub."
    },
    {
      question: "How do you define a dependency between jobs in a GitHub Actions workflow (e.g. run test only after build passes)?",
      options: ["needs: build", "depends_on: build", "after: build", "run_after: build"],
      correctAnswer: "needs: build",
      explanation: "The 'needs' keyword declares dependency requirements, ensuring preceding jobs complete successfully first."
    },
    {
      question: "How do you access repository secrets securely inside a GitHub Actions workflow file?",
      options: ["${{ env.SECRET_NAME }}", "${{ secrets.SECRET_NAME }}", "$SECRET_NAME", "getSecret('SECRET_NAME')"],
      correctAnswer: "${{ secrets.SECRET_NAME }}",
      explanation: "GitHub stores secrets securely in settings, and expands them in workflows via '${{ secrets.NAME }}' syntax."
    },
    {
      question: "What does the 'uses:' keyword define in a workflow step?",
      options: ["An environment variable assignment", "A pre-built community action or reusable step template to execute", "A command-line script to run", "The target operating system runtime"],
      correctAnswer: "A pre-built community action or reusable step template to execute",
      explanation: "'uses:' pulls prepackaged actions from the marketplace (e.g. actions/checkout@v3)."
    },
    {
      question: "What keyword defines the raw command-line scripts to run in a workflow step?",
      options: ["uses:", "run:", "script:", "cmd:"],
      correctAnswer: "run:",
      explanation: "'run:' specifies shell script executions (e.g. npm install, npm test)."
    },
    {
      question: "How do you run a job on a matrix (e.g. execute tests on Node 16, 18, and 20 in parallel)?",
      options: ["matrix: [16, 18, 20]", "strategy: { matrix: { node-version: [16, 18, 20] } }", "parallel: [16, 18, 20]", "run-on: multiple"],
      correctAnswer: "strategy: { matrix: { node-version: [16, 18, 20] } }",
      explanation: "A matrix strategy generates multiple parallel job configurations based on defined combinations."
    },
    {
      question: "Which directive specifies the operating system environment (e.g. Ubuntu, Windows) the runner runs on?",
      options: ["os:", "environment:", "runs-on:", "system:"],
      correctAnswer: "runs-on:",
      explanation: "'runs-on: ubuntu-latest' allocates a VM host matching the target image configuration."
    },
    {
      question: "How do you save a build output (like a compiled binary or zip) so it can be downloaded after the workflow completes?",
      options: ["Save to local hard drive", "Use the 'actions/upload-artifact' action step", "Commit it back to master branch", "Send it via email"],
      correctAnswer: "Use the 'actions/upload-artifact' action step",
      explanation: "upload-artifact copies files from the runner VM to secure GitHub storage, making them available as release links."
    }
  ],
  "Infrastructure as Code": [
    {
      question: "What is the core difference between Declarative and Imperative Infrastructure as Code?",
      options: ["Declarative specifies step-by-step shell instructions, Imperative declares desired states", "Declarative defines the desired final state of infrastructure and the tool figures out how to apply it, Imperative defines the sequential commands to achieve it", "Declarative operates on VMs, Imperative on databases", "There is no functional difference"],
      correctAnswer: "Declarative defines the desired final state of infrastructure and the tool figures out how to apply it, Imperative defines the sequential commands to achieve it",
      explanation: "Declarative tools (like Terraform) compile dependencies and resolve current-to-desired diffs automatically. Imperative tools (like Ansible scripts) run step-by-step actions."
    },
    {
      question: "Which of the following is a primary benefit of managing infrastructure as code?",
      options: ["Eliminating resource costs", "Consistency, auditability through version control, and rapid automated replication of environments", "Preventing software bugs", "Encrypting host filesystems"],
      correctAnswer: "Consistency, auditability through version control, and rapid automated replication of environments",
      explanation: "IaC eliminates manual configuration drift, enables change tracking in Git, and automates multi-region environment setups."
    },
    {
      question: "What is 'configuration drift' in infrastructure management?",
      options: ["When servers change locations physically", "When manual modifications made directly to active servers cause environment states to diverge from documented specifications", "When network IP addresses change dynamically", "A database optimization process"],
      correctAnswer: "When manual modifications made directly to active servers cause environment states to diverge from documented specifications",
      explanation: "Configuration drift occurs when ad-hoc manual tweaks are made to live systems, introducing inconsistencies that make automated updates fail."
    },
    {
      question: "Which of the following tools is primarily declarative and focuses on infrastructure provisioning rather than configuration management?",
      options: ["Ansible", "Chef", "Terraform", "Puppet"],
      correctAnswer: "Terraform",
      explanation: "Terraform is designed to provision infrastructure (VMs, VPCs, databases) declaratively. Ansible/Chef focus on configuring operating systems."
    },
    {
      question: "What does 'idempotency' mean in relation to IaC scripts?",
      options: ["The script runs once and then deletes itself", "Running the script multiple times yields the exact same target environment state without creating duplicate resources", "The script changes credentials after every run", "The script fails when resources already exist"],
      correctAnswer: "Running the script multiple times yields the exact same target environment state without creating duplicate resources",
      explanation: "Idempotent IaC tools audit active states, applying changes only if configurations differ from definitions, preventing duplicate setups."
    },
    {
      question: "Why is version control (e.g. Git) critical for IaC templates?",
      options: ["To run compilations faster", "To enable peer review (PRs), track change histories, rollback infrastructure states, and audit actions", "To store SSH keys", "To bypass firewall configs"],
      correctAnswer: "To enable peer review (PRs), track change histories, rollback infrastructure states, and audit actions",
      explanation: "Git serves as the auditing and change management log for infrastructure definitions, supporting pull request workflows."
    },
    {
      question: "What is 'State Management' in IaC?",
      options: ["Configuring regional server nodes", "Maintaining a file representation of active resources, mapping cloud identifiers to declarations", "Monitoring host CPU status", "Automating log rotations"],
      correctAnswer: "Maintaining a file representation of active resources, mapping cloud identifiers to declarations",
      explanation: "State files track what resources have been created, their metadata, and dependencies, serving as a cache for plan calculations."
    },
    {
      question: "What does 'Infrastructure Provisioning' mean?",
      options: ["Writing code programs", "Allocating and setting up physical or virtual servers, storage networks, and logical clouds from scratch", "Deploying packages inside OS", "Checking server ping speeds"],
      correctAnswer: "Allocating and setting up physical or virtual servers, storage networks, and logical clouds from scratch",
      explanation: "Provisioning creates the foundation infrastructure (network blocks, subnets, servers, disks) that host applications."
    },
    {
      question: "Which methodology treats servers as 'cattle' rather than 'pets'?",
      options: ["Immutable Infrastructure", "Manual administration", "Traditional provisioning", "Server configuration scripting"],
      correctAnswer: "Immutable Infrastructure",
      explanation: "Immutable infrastructure replaces servers entirely when updates are needed, rather than tweaking configurations on active nodes (cattle vs pets)."
    },
    {
      question: "What is Policy as Code (PaC)?",
      options: ["Writing employee handbook guidelines", "Writing code configurations to audit and enforce compliance, security rules, and cost constraints on infrastructure deployments", "Configuring firewall settings manually", "Running automated software updates"],
      correctAnswer: "Writing code configurations to audit and enforce compliance, security rules, and cost constraints on infrastructure deployments",
      explanation: "PaC (e.g. Open Policy Agent) evaluates IaC templates before deployment, failing pipelines if resource policies are violated."
    }
  ],
  "Terraform Basics": [
    {
      question: "What language is used to write Terraform configurations?",
      options: ["JSON", "YAML", "HashiCorp Configuration Language (HCL)", "Python"],
      correctAnswer: "HashiCorp Configuration Language (HCL)",
      explanation: "Terraform configurations are written in HCL, a human-readable declarative language."
    },
    {
      question: "Which command initializes a working directory containing Terraform configuration files, installing providers?",
      options: ["terraform plan", "terraform init", "terraform apply", "terraform validate"],
      correctAnswer: "terraform init",
      explanation: "'terraform init' downloads and installs backend providers and modules declared in configurations."
    },
    {
      question: "What does the command 'terraform plan' do?",
      options: ["Applies changes to the active cloud provider", "Creates an execution plan, previewing the resources Terraform will create, modify, or delete", "Deletes existing state files", "Formats configuration code automatically"],
      correctAnswer: "Creates an execution plan, previewing the resources Terraform will create, modify, or delete",
      explanation: "'plan' performs dry-run calculations, comparing current state, active cloud, and declared configuration files."
    },
    {
      question: "What file does Terraform use to map resources to configuration metadata and track active setups?",
      options: ["terraform.tfstate", "terraform.tfvars", "variables.tf", "main.tf"],
      correctAnswer: "terraform.tfstate",
      explanation: "The state file (terraform.tfstate) records resource attributes and dependency links of provisioned infrastructure."
    },
    {
      question: "Why should you store the Terraform state file in a remote backend (e.g. AWS S3) rather than locally?",
      options: ["Local hard drives are faster", "To enable collaboration, prevent state corruption, support state locking, and secure sensitive configurations", "It is a requirement to build images", "Remote storage is free"],
      correctAnswer: "To enable collaboration, prevent state corruption, support state locking, and secure sensitive configurations",
      explanation: "Remote backends store states centrally, preventing team overwrite conflicts via state locking mechanisms."
    },
    {
      question: "Which keyword is used to declare a resource (e.g. an EC2 instance or S3 bucket) in Terraform?",
      options: ["variable", "provider", "resource", "output"],
      correctAnswer: "resource",
      explanation: "The 'resource' block declares an infrastructure component (e.g. 'resource \"aws_instance\" \"web\"')."
    },
    {
      question: "What is a Terraform Module?",
      options: ["A cloud provider plug-in", "A packaged, reusable set of Terraform configuration files grouped in a directory to instantiate architectural patterns", "A script execution engine", "A variable list format"],
      correctAnswer: "A packaged, reusable set of Terraform configuration files grouped in a directory to instantiate architectural patterns",
      explanation: "Modules encapsulate common resource definitions (like a standard VPC setup) to support reuse across environments."
    },
    {
      question: "How do you specify a dependency between two resources that Terraform cannot infer automatically?",
      options: ["Using the 'depends_on' meta-argument", "Using variables", "Declaring them in the same file", "Running terraform apply sequentially"],
      correctAnswer: "Using the 'depends_on' meta-argument",
      explanation: "The 'depends_on' array forces Terraform to complete provisioning of a target resource before starting dependency builds."
    },
    {
      question: "Which command applies the configurations, modifying active cloud resource deployments?",
      options: ["terraform plan", "terraform apply", "terraform deploy", "terraform destroy"],
      correctAnswer: "terraform apply",
      explanation: "'terraform apply' executes plans, translating declarations into API calls targeting providers."
    },
    {
      question: "What does the command 'terraform destroy' accomplish?",
      options: ["Deletes local configuration code files", "Terminates and deletes all active infrastructure resources tracked by the state file", "Formats HCL syntax in directories", "Erases provider credentials history"],
      correctAnswer: "Terminates and deletes all active infrastructure resources tracked by the state file",
      explanation: "'destroy' cleans up environments by deleting all provisioned resources securely."
    }
  ],
  "Configuration Management": [
    {
      question: "What architecture model does Ansible use to configure hosts?",
      options: ["Agent-based (push model)", "Agentless (push model via SSH/WinRM)", "Agent-based (pull model)", "Agentless (pull model)"],
      correctAnswer: "Agentless (push model via SSH/WinRM)",
      explanation: "Ansible does not require installing background agents on client nodes. It pushes python modules over SSH to configure hosts."
    },
    {
      question: "What is the name of the file where you define target hosts and groups for Ansible?",
      options: ["playbook.yml", "ansible.cfg", "inventory (hosts)", "hosts.json"],
      correctAnswer: "inventory (hosts)",
      explanation: "The inventory file lists target host IP addresses, SSH ports, group classifications, and variables."
    },
    {
      question: "What language is used to write Ansible Playbooks?",
      options: ["JSON", "XML", "YAML", "INI"],
      correctAnswer: "YAML",
      explanation: "Ansible playbooks are declared in YAML format files."
    },
    {
      question: "What is an Ansible Task?",
      options: ["A command-line tool", "An action block that invokes a specific Ansible module to configure a host state", "A system timer", "An inventory definition"],
      correctAnswer: "An action block that invokes a specific Ansible module to configure a host state",
      explanation: "Tasks invoke modules (e.g. copy, service, apt) with arguments to verify or modify host parameters."
    },
    {
      question: "What does the Ansible 'apt' module do?",
      options: ["Manages users", "Manages package installations on Debian/Ubuntu systems", "Copies files over SSH", "Configures system settings"],
      correctAnswer: "Manages package installations on Debian/Ubuntu systems",
      explanation: "The 'apt' module invokes the local apt package manager to install, update, or remove software."
    },
    {
      question: "What are 'Ansible Facts'?",
      options: ["Documentation comments in playbooks", "System properties and variables gathered automatically from target hosts before task execution", "Encrypted secrets database", "Task completion logs"],
      correctAnswer: "System properties and variables gathered automatically from target hosts before task execution",
      explanation: "Facts gather host attributes (kernel version, IP addresses, disk sizes) that can be referenced in playbooks."
    },
    {
      question: "What template engine does Ansible use to generate configuration files dynamically?",
      options: ["EJS", "Jinja2", "Mustache", "Pug"],
      correctAnswer: "Jinja2",
      explanation: "Ansible uses Jinja2 templates (.j2) to evaluate variables and loops, writing configurations dynamically to target hosts."
    },
    {
      question: "What is an Ansible Handler?",
      options: ["An error-handling process", "A task triggered only when notified by another task that registered changes", "A variable processor", "An authentication module"],
      correctAnswer: "A task triggered only when notified by another task that registered changes",
      explanation: "Handlers (e.g. restart service) run at the end of plays if tasks notify them of modifications."
    },
    {
      question: "Which Ansible tool is used to encrypt sensitive variables or files, like passwords, at rest?",
      options: ["Ansible Vault", "Ansible Encrypt", "Ansible Secrets", "ssh-keygen"],
      correctAnswer: "Ansible Vault",
      explanation: "Ansible Vault encrypts YAML files or individual variables, decryption occurring at runtime using keys."
    },
    {
      question: "What is an Ansible Role?",
      options: ["A user permission group on hosts", "A structured directory organization that packs tasks, variables, files, templates, and modules together", "A task execution priority level", "An inventory host category"],
      correctAnswer: "A structured directory organization that packs tasks, variables, files, templates, and modules together",
      explanation: "Roles simplify playbooks by grouping related configuration assets in a standard filesystem hierarchy (tasks/, vars/, templates/)."
    }
  ],
  "Monitoring with Prometheus": [
    {
      question: "What metric collection model does Prometheus primarily use?",
      options: ["Push model (agents push to server)", "Pull model (server scrapes HTTP endpoints)", "Event-driven logs streaming", "Database query calls"],
      correctAnswer: "Pull model (server scrapes HTTP endpoints)",
      explanation: "Prometheus scrapes (pulls) metrics from exposed HTTP endpoints of target applications at regular intervals."
    },
    {
      question: "Which Prometheus metric type is a monotonically increasing cumulative value that only resets to 0 on restart?",
      options: ["Counter", "Gauge", "Histogram", "Summary"],
      correctAnswer: "Counter",
      explanation: "Counters track total events (e.g. HTTP request counts). They only go up (or reset)."
    },
    {
      question: "What is the query language used to extract metrics and formulate alert rules in Prometheus?",
      options: ["SQL", "InfluxQL", "PromQL", "LogQL"],
      correctAnswer: "PromQL",
      explanation: "PromQL (Prometheus Query Language) allows real-time aggregation and filtering of time-series data."
    },
    {
      question: "What component is used to scrape local system metrics (like CPU, RAM, disk usage) and expose them to Prometheus?",
      options: ["Pushgateway", "Node Exporter", "Alertmanager", "kube-proxy"],
      correctAnswer: "Node Exporter",
      explanation: "Node Exporter runs as a daemon on hosts, exposing hardware/OS metrics on an HTTP port."
    },
    {
      question: "What is the purpose of the Prometheus Pushgateway?",
      options: ["Routing alerts to Slack", "Allowing short-lived or batch jobs to push metrics to a gateway that Prometheus can later scrape", "Compressing database logs", "Serving Grafana dashboards"],
      correctAnswer: "Allowing short-lived or batch jobs to push metrics to a gateway that Prometheus can later scrape",
      explanation: "Because Prometheus pulls metrics, short-lived jobs exit before scrapers run. Pushgateway caches metrics for them."
    },
    {
      question: "Where are metric alerts generated, and which component routes them to notification channels (email, Slack)?",
      options: ["Generated in Grafana, routed by Prometheus", "Generated in Prometheus, routed by Alertmanager", "Generated and routed by Node Exporter", "Generated by Pushgateway, routed by etcd"],
      correctAnswer: "Generated in Prometheus, routed by Alertmanager",
      explanation: "Prometheus evaluates alerting rules and forwards active triggers to Alertmanager, which handles routing and deduplication."
    },
    {
      question: "Which metric type represents a single numerical value that can go up and down arbitrarily (e.g. memory usage)?",
      options: ["Counter", "Gauge", "Histogram", "Time-Series"],
      correctAnswer: "Gauge",
      explanation: "Gauges represent transient states that fluctuate (e.g. CPU temperature, queue lengths)."
    },
    {
      question: "In prometheus.yml, what block defines target hosts and ports to query metrics from?",
      options: ["alerting:", "scrape_configs:", "global:", "rule_files:"],
      correctAnswer: "scrape_configs:",
      explanation: "scrape_configs lists jobs, scrape intervals, paths, and target host configurations."
    },
    {
      question: "What datastore does Prometheus use to store time-series metrics?",
      options: ["Relational Database (PostgreSQL)", "Time-Series Database (TSDB)", "Document Database (MongoDB)", "Graph Database (Neo4j)"],
      correctAnswer: "Time-Series Database (TSDB)",
      explanation: "Prometheus uses a custom, highly optimized local TSDB to organize metric flows by timestamp and labels."
    },
    {
      question: "What is Prometheus instrumentation?",
      options: ["Connecting server hardware parts", "Integrating monitoring library packages inside application code to track custom metric data", "Configuring firewall settings", "Creating visualization graphics"],
      correctAnswer: "Integrating monitoring library packages inside application code to track custom metric data",
      explanation: "Instrumentation involves adding metric objects (counters, gauges) into source code to track application logic execution."
    }
  ],
  "Visualization with Grafana": [
    {
      question: "What is Grafana's primary role in a DevOps monitoring stack?",
      options: ["Collecting server metrics via agent logs", "Visualizing time-series data from multiple sources in beautiful, customizable dashboards", "Routing network traffic", "Scheduling task scripts"],
      correctAnswer: "Visualizing time-series data from multiple sources in beautiful, customizable dashboards",
      explanation: "Grafana is a data visualization and analytics tool that connects to backends like Prometheus or Elasticsearch."
    },
    {
      question: "What is a Grafana 'Data Source'?",
      options: ["The code file containing logic scripts", "A connected database or service (e.g. Prometheus, CloudWatch, PostgreSQL) that Grafana queries metrics from", "A host server port", "An admin user account"],
      correctAnswer: "A connected database or service (e.g. Prometheus, CloudWatch, PostgreSQL) that Grafana queries metrics from",
      explanation: "Data Sources declare connection addresses, credentials, and query types for visualization targets."
    },
    {
      question: "Which panel type is best suited to display a single metric's current numerical value prominently (e.g. active users)?",
      options: ["Graph panel", "Stat panel", "Table panel", "Heatmap panel"],
      correctAnswer: "Stat panel",
      explanation: "Stat panels render large single values, sparklines, and status colors based on thresholds."
    },
    {
      question: "What are Grafana Dashboard Variables used for?",
      options: ["Storing database passwords safely", "Allowing users to filter and switch dashboard views dynamically (e.g. select server IP from a dropdown)", "Running arithmetic formulas", "Configuring email servers"],
      correctAnswer: "Allowing users to filter and switch dashboard views dynamically (e.g. select server IP from a dropdown)",
      explanation: "Variables create dropdowns in headers, updates query parameters dynamically across panels."
    },
    {
      question: "Can Grafana trigger alerts based on panel query thresholds?",
      options: ["No, alerts are only handled by database engines", "Yes, Grafana evaluates query rules and can trigger alerts to channels like Discord or PagerDuty", "Yes, but only for Slack target receivers", "Only on enterprise plans"],
      correctAnswer: "Yes, Grafana evaluates query rules and can trigger alerts to channels like Discord or PagerDuty",
      explanation: "Grafana has built-in alerting that checks panel queries and routes triggers to contact points."
    },
    {
      question: "What does Grafana Provisioning refer to?",
      options: ["Buying hosting accounts", "Configuring dashboards and data sources using YAML files, managing visualization setups as code", "Upgrading container memory allocations", "Creating database schemas"],
      correctAnswer: "Configuring dashboards and data sources using YAML files, managing visualization setups as code",
      explanation: "Provisioning directories auto-load YAML data source and dashboard configurations, eliminating manual UI setups."
    },
    {
      question: "How do you share a read-only live view of a Grafana panel or dashboard externally?",
      options: ["Expose Grafana admin credentials", "Generate a Snapshot link or export the dashboard JSON schema", "Copy local host addresses", "Send screenshots manually only"],
      correctAnswer: "Generate a Snapshot link or export the dashboard JSON schema",
      explanation: "Snapshots compile static metric snapshots, making them shareable via custom URLs without authentication."
    },
    {
      question: "What is the purpose of panel query overrides in Grafana?",
      options: ["Disabling database queries completely", "Customizing visual options (colors, names, decimals) for a specific metric series in a shared panel", "Encrypting communication streams", "Changing backend user groups"],
      correctAnswer: "Customizing visual options (colors, names, decimals) for a specific metric series in a shared panel",
      explanation: "Overrides alter visualization parameters (like rendering one target query line in dotted red) without changing query logic."
    },
    {
      question: "Which query field maps variables dynamically in Grafana PromQL panels?",
      options: ["$__interval", "$node", "$var", "Both A and B"],
      correctAnswer: "Both A and B",
      explanation: "$__interval calculates optimal scrape steps, and '$node' expands custom variables."
    },
    {
      question: "What is Grafana Loki used for?",
      options: ["Storing time-series CPU values", "A horizontally-scalable, highly-available, multi-tenant log aggregation system", "A cloud load balancer setup", "Creating visual diagrams"],
      correctAnswer: "A horizontally-scalable, highly-available, multi-tenant log aggregation system",
      explanation: "Loki gathers and indexes system/container log streams, serving as 'Prometheus for logs'."
    }
  ],
  "AWS Cloud Basics": [
    {
      question: "What are the three core service categories of cloud computing?",
      options: ["IaaS, PaaS, SaaS", "EC2, S3, IAM", "Public, Private, Hybrid", "TCP, UDP, IP"],
      correctAnswer: "IaaS, PaaS, SaaS",
      explanation: "IaaS (Infrastructure), PaaS (Platform), SaaS (Software) define standard service boundaries."
    },
    {
      question: "What is the difference between an AWS Region and an Availability Zone (AZ)?",
      options: ["Regions contain AZs; AZs are physically isolated data center locations within a region", "AZs contain Regions; Regions are data centers", "Regions are physical, AZs are virtual networks", "There is no difference"],
      correctAnswer: "Regions contain AZs; AZs are physically isolated data center locations within a region",
      explanation: "Regions represent geographic areas. Each Region contains multiple, isolated Availability Zones connected by low-latency links."
    },
    {
      question: "What AWS service is used to manage identities, users, groups, and resource access permissions securely?",
      options: ["Amazon EC2", "AWS IAM", "Amazon VPC", "AWS CloudTrail"],
      correctAnswer: "AWS IAM",
      explanation: "Identity and Access Management (IAM) controls authentication, policies, and access roles."
    },
    {
      question: "What is an Amazon Machine Image (AMI)?",
      options: ["A screenshot of application dashboards", "A template containing a software configuration (OS, application server, and applications) to launch EC2 VMs", "An encryption key file", "A network routing rule"],
      correctAnswer: "A template containing a software configuration (OS, application server, and applications) to launch EC2 VMs",
      explanation: "AMIs act as prepackaged boot drives containing the operating systems and files needed to launch instances."
    },
    {
      question: "What is Amazon S3?",
      options: ["A relational database service", "A highly scalable object storage service", "A network firewall ruleset", "A compute engine for lambda functions"],
      correctAnswer: "Amazon S3",
      explanation: "Simple Storage Service (S3) stores data as objects (files) in directories called Buckets."
    },
    {
      question: "What is an AWS VPC?",
      options: ["A secure virtual private network tunnel link", "A logically isolated virtual network allocated to your AWS account", "A cloud security group rule set", "A compute database engine"],
      correctAnswer: "Amazon VPC",
      explanation: "Virtual Private Cloud (VPC) provisions a private networking partition where you control subnets, gateways, and routing tables."
    },
    {
      question: "What is the difference between an AWS Security Group and a Network Access Control List (NACL)?",
      options: ["Security Groups are stateless; NACLs are stateful", "Security Groups act as instance-level stateful firewalls; NACLs act as subnet-level stateless firewalls", "Security Groups apply to VPCs; NACLs apply to files", "Security Groups are public; NACLs are private"],
      correctAnswer: "Security Groups act as instance-level stateful firewalls; NACLs act as subnet-level stateless firewalls",
      explanation: "Security Group rules automatically evaluate responses (stateful) at the host VM. NACLs require separate inbound and outbound configurations (stateless) at the subnet."
    },
    {
      question: "Which service automatically scales EC2 VM instances up or down based on CPU load or custom parameters?",
      options: ["Elastic Load Balancing", "Auto Scaling Groups", "AWS Lambda", "Amazon Route 53"],
      correctAnswer: "Auto Scaling Groups",
      explanation: "Auto Scaling monitors application capacity, spinning up or deleting instances based on load policies."
    },
    {
      question: "What is Amazon Route 53?",
      options: ["A packet routing firewall", "A highly available and scalable Domain Name System (DNS) web service", "An internet gateway setup script", "A cloud security group rules template"],
      correctAnswer: "A highly available and scalable Domain Name System (DNS) web service",
      explanation: "Route 53 resolves DNS queries and routes public domain requests to resources like CloudFront, S3, or ALB."
    },
    {
      question: "What is AWS CloudWatch used for?",
      options: ["Scanning code files for vulnerabilities", "Monitoring applications, collecting metrics, collecting logs, and setting alarm triggers", "Provisioning EC2 resources as code", "Encrypting database connections"],
      correctAnswer: "Monitoring applications, collecting metrics, collecting logs, and setting alarm triggers",
      explanation: "CloudWatch compiles logs, metrics, and events from AWS resources, providing alerting triggers based on performance thresholds."
    }
  ],
  "Full CI/CD Pipeline Project": [
    {
      question: "What does GitOps refer to in continuous deployment?",
      options: ["Developing code on Git branches directly", "Using Git repositories as the single source of truth for declarative infrastructure and application deployments", "Restricting database connections via Git tags", "Running manual scripts after merging"],
      correctAnswer: "Using Git repositories as the single source of truth for declarative infrastructure and application deployments",
      explanation: "In GitOps, the repository state defines the target environment. Pull agents (like ArgoCD) reconcile states automatically."
    },
    {
      question: "Why should you separate your application source code repository from your environment configuration repository?",
      options: ["To slow down developer compilation speeds", "To prevent build loops, isolate security credentials, and simplify access controls for infrastructure changes", "It is a requirement of Docker", "GitHub doesn't host multiple repos"],
      correctAnswer: "To prevent build loops, isolate security credentials, and simplify access controls for infrastructure changes",
      explanation: "Separation isolates build logic from deployment manifestations, preventing accidental deployments on source edits."
    },
    {
      question: "What is the role of ArgoCD in a Kubernetes continuous deployment pipeline?",
      options: ["Compiling Docker image files", "A declarative, GitOps continuous delivery tool for Kubernetes that syncs cluster states with Git repositories", "Managing local worker node memory", "A DNS nameserver resolution engine"],
      correctAnswer: "A declarative, GitOps continuous delivery tool for Kubernetes that syncs cluster states with Git repositories",
      explanation: "ArgoCD monitors git configurations and reconciles cluster configurations dynamically to match repositories."
    },
    {
      question: "How do you securely manage production database passwords in a CI/CD pipeline?",
      options: ["Write them in docker-compose.yml files directly", "Use secrets management services (e.g. AWS Secrets Manager, HashiCorp Vault) and inject them at runtime", "Commit them inside encrypted Git branches", "Print them to compilation logs"],
      correctAnswer: "Use secrets management services (e.g. AWS Secrets Manager, HashiCorp Vault) and inject them at runtime",
      explanation: "Vault/Secrets managers encrypt credentials at rest, exposing them to containers dynamically without text logs."
    },
    {
      question: "What is the purpose of promoting a release (e.g. promoting from Staging to Production)?",
      options: ["Rewriting developer code files", "Testing and verifying the exact same audited artifact (e.g. container image) in a staging environment before releasing it to production", "Exposing databases to the internet", "Upgrading server operating systems"],
      correctAnswer: "Testing and verifying the exact same audited artifact (e.g. container image) in a staging environment before releasing it to production",
      explanation: "Promotion ensures the exact image verified in QA is deployed to production, reducing configuration anomalies."
    },
    {
      question: "Which test type verifies that the combination of multiple container services (frontend, API, database) works correctly together in a staging environment?",
      options: ["Unit testing", "Integration testing", "Static code analysis", "Security scanning"],
      correctAnswer: "Integration testing",
      explanation: "Integration tests verify contract communication, routing, and database responses across services."
    },
    {
      question: "How do you rollback a failed deployment inside a GitOps Kubernetes cluster?",
      options: ["Reboot the physical cluster nodes manually", "Revert (git revert) the configuration changes in the Git repository, letting the controller sync the previous state", "Delete the namespaces", "Recompile application code files"],
      correctAnswer: "Revert (git revert) the configuration changes in the Git repository, letting the controller sync the previous state",
      explanation: "Because Git is the source of truth, reverting commits triggers the pull controller to restore the previous stable cluster configuration."
    },
    {
      question: "What is the purpose of a health check endpoint (e.g. /healthz) in a deployment pipeline?",
      options: ["To log developer sign-in histories", "To provide automated load balancers and schedulers a way to audit if the application is fully booted and ready to receive traffic", "To run unit tests inside production", "To download log reports"],
      correctAnswer: "To provide automated load balancers and schedulers a way to audit if the application is fully booted and ready to receive traffic",
      explanation: "Health checks return HTTP statuses indicating status readiness, preventing traffic routing to dead nodes."
    },
    {
      question: "What does the term 'Deployment Pipeline Orchestration' signify?",
      options: ["Typing commands manually in servers", "Managing and linking all automated building, testing, containerizing, provisioning, and deployment phases together as a unified flow", "Configuring firewall settings", "Creating visual diagrams"],
      correctAnswer: "Managing and linking all automated building, testing, containerizing, provisioning, and deployment phases together as a unified flow",
      explanation: "Orchestration sequences tools (Git, Jenkins, Terraform, Docker, Kubernetes) into a repeatable release cycle."
    },
    {
      question: "What is a major advantage of utilizing Docker containers in a deployment project?",
      options: ["Containers run programs faster than native hardware", "Containers package application files and dependencies together, guaranteeing execution consistency across dev, staging, and production environments", "Containers eliminate network configurations", "Containers automate database index calculations"],
      correctAnswer: "Containers package application files and dependencies together, guaranteeing execution consistency across dev, staging, and production environments",
      explanation: "Containers resolve dependency drift ('it works on my machine') by packaging runtimes, binaries, and OS libraries in portable images."
    }
  ]
};

async function seedDevOpsAssessments() {
  try {
    const devopsDomain = await Domain.findOne({ slug: 'devops' });
    if (!devopsDomain) {
      console.log('⚠️ DevOps domain not found. Skipping assessment seeding.');
      return;
    }

    console.log('🌱 Seeding DevOps mini-assessments...');
    
    let count = 0;
    for (const [topicTitle, questions] of Object.entries(questionsData)) {
      const topicObj = await Topic.findOne({ domainId: devopsDomain._id, title: topicTitle });
      if (!topicObj) {
        console.log(`⚠️ Topic '${topicTitle}' not found in database. Skipping.`);
        continue;
      }

      const assessmentExists = await DevOpsAssessment.findOne({ moduleId: topicObj._id });
      if (assessmentExists) {
        assessmentExists.title = `${topicTitle} Assessment`;
        assessmentExists.roadmapId = devopsDomain._id;
        assessmentExists.levelId = topicObj.phaseId;
        assessmentExists.questions = questions;
        await assessmentExists.save();
      } else {
        await DevOpsAssessment.create({
          roadmapId: devopsDomain._id,
          levelId: topicObj.phaseId,
          moduleId: topicObj._id,
          title: `${topicTitle} Assessment`,
          questions
        });
      }
      count++;
    }

    console.log(`✅ Seeded ${count} DevOps mini-assessments!`);
  } catch (error) {
    console.error('❌ Error seeding DevOps assessments:', error.message);
    throw error;
  }
}

module.exports = seedDevOpsAssessments;

if (require.main === module) {
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.join(__dirname, '../.env') });
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge';
  mongoose.connect(uri)
    .then(() => seedDevOpsAssessments())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('CLI Seed Error:', err);
      process.exit(1);
    });
}
