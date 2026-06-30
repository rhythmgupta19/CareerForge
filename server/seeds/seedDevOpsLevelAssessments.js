const mongoose = require('mongoose');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const DevOpsAssessment = require('../models/DevOpsAssessment');

const level1Questions = [
  {
    question: "Which OSI model layer is responsible for routing packets across different networks?",
    options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
    correctAnswer: "Network Layer",
    explanation: "The Network Layer handles packet routing, forwarding, and logical addressing (IP addresses)."
  },
  {
    question: "What is the primary role of the Address Resolution Protocol (ARP)?",
    options: [
      "Resolve hostnames to IP addresses",
      "Map IP addresses to physical MAC addresses",
      "Assign dynamic IP addresses to clients",
      "Establish secure encrypted tunnels"
    ],
    correctAnswer: "Map IP addresses to physical MAC addresses",
    explanation: "ARP operates at the Data Link Layer to translate a known IP address into a physical MAC address on a local network."
  },
  {
    question: "Which DNS record type maps an alias name to a canonical/true domain name?",
    options: ["A Record", "MX Record", "CNAME Record", "TXT Record"],
    correctAnswer: "CNAME Record",
    explanation: "CNAME (Canonical Name) records are used to alias one name to another canonical domain name."
  },
  {
    question: "Which TCP flag is sent to initiate the three-way handshake connection?",
    options: ["ACK", "SYN", "FIN", "RST"],
    correctAnswer: "SYN",
    explanation: "A client initiates a TCP connection by sending a segment with the SYN (Synchronize) flag set."
  },
  {
    question: "What is the default port used for secure encrypted web traffic (HTTPS)?",
    options: ["80", "8080", "443", "22"],
    correctAnswer: "443",
    explanation: "HTTPS (HTTP Secure) uses port 443 by default, whereas plain text HTTP uses port 80."
  },
  {
    question: "What does the TTL (Time to Live) value in a DNS record indicate?",
    options: [
      "The bandwidth speed of the server",
      "The duration in seconds the record can be cached before querying again",
      "The encryption level of the lookup",
      "The remaining uptime of the hosting provider"
    ],
    correctAnswer: "The duration in seconds the record can be cached before querying again",
    explanation: "TTL tells resolvers and clients how many seconds they should store the DNS record in cache before requesting fresh data."
  },
  {
    question: "Which HTTP status code represents 'Unauthorized Access' (requiring authentication)?",
    options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
    correctAnswer: "401 Unauthorized",
    explanation: "HTTP 401 indicates that the request requires user authentication credentials."
  },
  {
    question: "Which protocol does the utility 'ping' use to test connection latency and accessibility?",
    options: ["TCP", "UDP", "ICMP", "ARP"],
    correctAnswer: "ICMP",
    explanation: "Ping uses ICMP (Internet Control Message Protocol) Echo Request and Echo Reply messages."
  },
  {
    question: "What is a key difference between TCP and UDP traffic?",
    options: [
      "TCP is faster than UDP",
      "TCP is connection-oriented and reliable, while UDP is connectionless and lightweight",
      "UDP ensures all packets arrive in correct order",
      "TCP only works over local networks"
    ],
    correctAnswer: "TCP is connection-oriented and reliable, while UDP is connectionless and lightweight",
    explanation: "TCP performs handshakes, sequencing, and retries to guarantee delivery. UDP sends packets without connection overhead, making it faster but unreliable."
  },
  {
    question: "Which HTTP request method is designed to be safe and idempotent for retrieving resources?",
    options: ["POST", "GET", "PATCH", "DELETE"],
    correctAnswer: "GET",
    explanation: "GET requests are read-only ('safe') and idempotent, meaning multiple identical requests produce the same server state."
  },
  {
    question: "What is the function of a firewall inside a server network?",
    options: [
      "Accelerate domain resolve caching speed",
      "Monitor and filter network traffic based on predefined security rules",
      "Encrypt local file system storage",
      "Generate dynamic IP addresses"
    ],
    correctAnswer: "Monitor and filter network traffic based on predefined security rules",
    explanation: "Firewalls establish a barrier between trusted and untrusted networks, inspecting and blocking traffic according to security rules."
  },
  {
    question: "Which DNS record type specifies the mail servers responsible for accepting emails on behalf of a domain?",
    options: ["A", "CNAME", "MX", "NS"],
    correctAnswer: "MX",
    explanation: "MX (Mail Exchanger) records route a domain's email traffic to the appropriate email servers."
  },
  {
    question: "In IP subnetting, what is the purpose of CIDR (Classless Inter-Domain Routing) notation?",
    options: [
      "To measure network routing distance in miles",
      "To define flexible network routing boundaries instead of rigid IP classes",
      "To automatically register domains in DNS",
      "To convert IPv4 packets to IPv6"
    ],
    correctAnswer: "To define flexible network routing boundaries instead of rigid IP classes",
    explanation: "CIDR notation (e.g. /24) defines the network prefix size, allowing optimized subnet sizing and routing tables."
  },
  {
    question: "What is the purpose of the HTTP Header 'Host'?",
    options: [
      "To authenticate the client credentials",
      "To specify the target domain name the client is requesting from the server",
      "To cache static images locally",
      "To choose the compression algorithm"
    ],
    correctAnswer: "To specify the target domain name the client is requesting from the server",
    explanation: "The Host header enables virtual hosting, allowing a single web server IP to host and route requests for multiple domains."
  },
  {
    question: "Which of the following is a private IP address range according to RFC 1918?",
    options: ["8.8.8.8", "192.168.0.0/16", "1.1.1.1", "200.100.50.0/24"],
    correctAnswer: "192.168.0.0/16",
    explanation: "RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 for private local area networks."
  }
];

const level2Questions = [
  {
    question: "Which command shows running processes dynamically in real-time, including CPU and memory usage?",
    options: ["ps -ef", "top", "df -h", "free -m"],
    correctAnswer: "top",
    explanation: "'top' provides an interactive, real-time updated view of system resource usage and running processes."
  },
  {
    question: "What permission set does the octal value 644 represent?",
    options: [
      "Read/Write for owner, Read-only for group and others",
      "Read/Write/Execute for all",
      "Read/Write for owner and group, Write-only for others",
      "Execute-only for all users"
    ],
    correctAnswer: "Read/Write for owner, Read-only for group and others",
    explanation: "6 (rw-) for owner, 4 (r--) for group, 4 (r--) for others."
  },
  {
    question: "Which standard Linux configuration file contains basic user account details (excluding passwords)?",
    options: ["/etc/shadow", "/etc/passwd", "/etc/group", "/etc/hosts"],
    correctAnswer: "/etc/passwd",
    explanation: "/etc/passwd stores user account details like username, UID, primary GID, home directory path, and shell."
  },
  {
    question: "How do you run a shell command in the background, freeing up the active terminal prompt?",
    options: ["Append '&' at the end of the command", "Prepend 'bg' before the command", "Append '| wait' at the end", "Press Ctrl+C immediately after launch"],
    correctAnswer: "Append '&' at the end of the command",
    explanation: "Appending an ampersand (&) to a command runs it as a background job."
  },
  {
    question: "Which signal does the command 'kill -9 <PID>' send to a process?",
    options: ["SIGTERM", "SIGINT", "SIGKILL", "SIGSTOP"],
    correctAnswer: "SIGKILL",
    explanation: "Signal 9 is SIGKILL, which forces the kernel to terminate the process immediately without cleanup."
  },
  {
    question: "Which directory contains temporary files that are usually cleared automatically during system reboot?",
    options: ["/var", "/tmp", "/etc", "/opt"],
    correctAnswer: "/tmp",
    explanation: "/tmp is designated for temporary files and is typically cleared on startup/reboot."
  },
  {
    question: "Which command displays disk partition space consumption in a human-readable format?",
    options: ["du -sh", "df -h", "free -h", "fdisk -l"],
    correctAnswer: "df -h",
    explanation: "'df -h' reports disk space usage for all mounted filesystems in human-readable units (G, M, K)."
  },
  {
    question: "What is the effect of running the command 'chmod +x deploy.sh'?",
    options: [
      "It deletes the script file",
      "It makes the script file executable by users",
      "It encrypts the script contents",
      "It prints script contents to stdout"
    ],
    correctAnswer: "It makes the script file executable by users",
    explanation: "chmod +x adds execution rights (x) to the file permissions."
  },
  {
    question: "What is the Parent Process ID (PPID) of the system's first user space process (init/systemd)?",
    options: ["0", "1", "100", "systemd has no parent"],
    correctAnswer: "0",
    explanation: "The first user process (PID 1) is spawned directly by the kernel, giving it a PPID of 0."
  },
  {
    question: "What is an orphan process in a Linux system?",
    options: [
      "A process running without memory limits",
      "A process whose parent has terminated, leaving init (PID 1) to adopt it",
      "A process that has completed execution but remains in the process table",
      "A process with a negative priority"
    ],
    correctAnswer: "A process whose parent has terminated, leaving init (PID 1) to adopt it",
    explanation: "When a parent process exits before its child, the child becomes orphaned and is adopted by PID 1."
  },
  {
    question: "Which parameter for the 'ls' command allows you to view hidden files (files starting with a dot)?",
    options: ["-l", "-h", "-a", "-r"],
    correctAnswer: "-a",
    explanation: "The '-a' (all) option lists hidden files along with normal files."
  },
  {
    question: "What is the special device file '/dev/null' used for?",
    options: [
      "To store backup directories",
      "To act as a data sink, discarding all data written to it",
      "To generate random passwords",
      "To route outbound web requests"
    ],
    correctAnswer: "To act as a data sink, discarding all data written to it",
    explanation: "/dev/null is a virtual device that immediately discards all input and returns EOF on read."
  },
  {
    question: "Which command is used to modify passwords for accounts in Linux?",
    options: ["chpasswd", "passwd", "userpass", "shadow"],
    correctAnswer: "passwd",
    explanation: "The 'passwd' command allows administrators and users to change user passwords."
  },
  {
    question: "What is the purpose of the 'tar -czf archive.tar.gz folder/' command?",
    options: [
      "To decompress a zipped file",
      "To create a compressed gzipped tarball archive of the folder",
      "To download a folder from remote link",
      "To check folder integrity"
    ],
    correctAnswer: "To create a compressed gzipped tarball archive of the folder",
    explanation: "-c (create), -z (gzip compress), -f (archive filename)."
  },
  {
    question: "Which command recursively searches files and directories matching specific patterns?",
    options: ["grep", "find", "locate", "whereis"],
    correctAnswer: "find",
    explanation: "'find' scans the directory tree matching files based on names, sizes, types, and permissions."
  },
  {
    question: "What is the purpose of setting the Sticky Bit permission on a shared directory like '/tmp'?",
    options: [
      "To speed up file search operations",
      "To prevent users from deleting or renaming files owned by other users",
      "To encrypt all directory files automatically",
      "To grant root access to anyone entering"
    ],
    correctAnswer: "To prevent users from deleting or renaming files owned by other users",
    explanation: "When the sticky bit is set, write permissions on the directory allow creating files, but only the file owner or root can delete/rename files."
  },
  {
    question: "Which command lists currently mounted filesystems and their configurations?",
    options: ["mount", "df", "lsblk", "fdisk"],
    correctAnswer: "mount",
    explanation: "'mount' with no arguments prints list of active mounted devices."
  },
  {
    question: "What does the command 'sudo -i' do?",
    options: [
      "Lists all logs in system",
      "Simulates an interactive login shell as the root user",
      "Installs a new package",
      "Gives system hardware specifications"
    ],
    correctAnswer: "Simulates an interactive login shell as the root user",
    explanation: "'sudo -i' runs a login shell as the target user (root by default), loading root's profiles."
  },
  {
    question: "Which file provides local static hostname mappings to IP addresses?",
    options: ["/etc/resolv.conf", "/etc/hosts", "/etc/hostname", "/etc/networks"],
    correctAnswer: "/etc/hosts",
    explanation: "/etc/hosts maps hostnames to IP addresses locally, preceding DNS resolution queries."
  },
  {
    question: "What is the purpose of the 'nice' command?",
    options: [
      "Format print outputs cleanly",
      "Launch a process with a specific CPU scheduling priority (niceness)",
      "Speed up package downloads",
      "Check terminal settings"
    ],
    correctAnswer: "Launch a process with a specific CPU scheduling priority (niceness)",
    explanation: "'nice' changes the priority of a process; a higher niceness reduces priority, whereas negative values increase it."
  }
];

const level3Questions = [
  {
    question: "Which Git command is used to stage modifications in your workspace, preparing them to be committed?",
    options: ["git commit", "git push", "git add", "git stage-all"],
    correctAnswer: "git add",
    explanation: "'git add' marks files as staged in the Git index, queueing them for the next commit."
  },
  {
    question: "What is the Git command to view full commit log histories?",
    options: ["git history", "git status", "git log", "git show"],
    correctAnswer: "git log",
    explanation: "'git log' lists all commits sequentially starting from the most recent."
  },
  {
    question: "How do you create a new branch named 'feature-auth' and switch to it immediately?",
    options: [
      "git branch feature-auth",
      "git checkout -b feature-auth",
      "git switch-create feature-auth",
      "git merge feature-auth"
    ],
    correctAnswer: "git checkout -b feature-auth",
    explanation: "'-b' tells checkout to create the branch first, then check it out."
  },
  {
    question: "What is a merge conflict in Git?",
    options: [
      "A failure to connect to GitHub remote servers",
      "A scenario where Git cannot automatically reconcile concurrent line changes made to the same file",
      "An error when staging files that are too large",
      "Merging two branches with different names"
    ],
    correctAnswer: "A scenario where Git cannot automatically reconcile concurrent line changes made to the same file",
    explanation: "Merge conflicts occur when changes are made to the exact same lines of code in different branches, requiring developer manual resolution."
  },
  {
    question: "Which Git command fetches commits from remote and immediately merges them into the current active branch?",
    options: ["git fetch", "git pull", "git sync", "git clone"],
    correctAnswer: "git pull",
    explanation: "'git pull' is a shortcut that performs a 'git fetch' followed by a 'git merge'."
  },
  {
    question: "What is the difference between 'git fetch' and 'git pull'?",
    options: [
      "Fetch only downloads metadata; pull downloads the files",
      "Fetch only downloads changes to local cache without merging; pull downloads and merges",
      "Fetch is dangerous and deletes code; pull is safe",
      "There is no difference"
    ],
    correctAnswer: "Fetch only downloads changes to local cache without merging; pull downloads and merges",
    explanation: "Fetch keeps your workspace isolated, letting you inspect remote updates. Pull applies updates automatically."
  },
  {
    question: "How do you forcefully discard all uncommitted local modifications and reset your directory state to the last commit?",
    options: ["git clean -f", "git reset --hard HEAD", "git revert HEAD", "git checkout --clean"],
    correctAnswer: "git reset --hard HEAD",
    explanation: "git reset --hard HEAD resets both the staging index and working directory, wiping out uncommitted changes."
  },
  {
    question: "What is a Pull Request (PR) on GitHub?",
    options: [
      "A request to download a repository ZIP file",
      "A proposal to merge code changes from a source branch into a target branch",
      "A command to clone code to your desktop",
      "An email request to delete a branch"
    ],
    correctAnswer: "A proposal to merge code changes from a source branch into a target branch",
    explanation: "PRs on GitHub enable code reviews, discussions, and status checks before merging branch changes into main branches."
  },
  {
    question: "Which Git command lists all local and remote branches in your repository?",
    options: ["git branch", "git branch -a", "git branch --remote", "git show-branches"],
    correctAnswer: "git branch -a",
    explanation: "'-a' stands for 'all' and displays both local branches and remote-tracking references."
  },
  {
    question: "What is the primary purpose of 'git stash'?",
    options: [
      "Permanently delete local files",
      "Temporarily save modified, tracked files in a dirty working directory to be restored later",
      "Upload commits to remote servers",
      "Mark a commit as stable"
    ],
    correctAnswer: "Temporarily save modified, tracked files in a dirty working directory to be restored later",
    explanation: "git stash shelves your local modifications, returning the workspace to a clean HEAD state."
  },
  {
    question: "Which Git command captures a snapshot of current staged changes and saves it to local history?",
    options: ["git save", "git commit", "git push", "git record"],
    correctAnswer: "git commit",
    explanation: "'git commit' records the staged index state as a new commit node in the history DAG."
  },
  {
    question: "What does the command 'git clone <url>' do?",
    options: [
      "Creates a new fork on GitHub",
      "Initializes a blank local git folder",
      "Downloads and copies an existing remote repository locally",
      "Compares differences between branches"
    ],
    correctAnswer: "Downloads and copies an existing remote repository locally",
    explanation: "'git clone' maps remote repositories to local folders, setting up origin tracking automatically."
  },
  {
    question: "Which command applies the exact code changes of a single, specific commit from another branch onto your active branch?",
    options: ["git merge-commit", "git cherry-pick", "git copy-commit", "git rebase-apply"],
    correctAnswer: "git cherry-pick",
    explanation: "'git cherry-pick <commit-hash>' appends a new commit replicating changes introduced by the target commit."
  },
  {
    question: "What is the purpose of a '.gitignore' file?",
    options: [
      "To encrypt security keys",
      "To prevent specific untracked files and patterns from being added to Git history",
      "To list developers on the project",
      "To configure repository description"
    ],
    correctAnswer: "To prevent specific untracked files and patterns from being added to Git history",
    explanation: "Git reads the .gitignore file to exclude match paths (like node_modules/ or secrets.json) from tracking."
  },
  {
    question: "What is a fast-forward merge in Git?",
    options: [
      "A merge completed at high network speed",
      "A merge where target branch pointer is simply moved directly to the source branch tip because no new divergent commits exist",
      "A merge that skips commit validations",
      "Merging two branches without local workspaces"
    ],
    correctAnswer: "A merge where target branch pointer is simply moved directly to the source branch tip because no new divergent commits exist",
    explanation: "If the target branch has no newer commits than the source branch base, Git performs a fast-forward without creating a merge commit node."
  },
  {
    question: "What is the effect of 'git rebase main' on a feature branch?",
    options: [
      "It merges feature commits into main",
      "It rewrites feature commits to branch off from the latest tip commit of main",
      "It locks the feature branch from changes",
      "It discards feature branch commits"
    ],
    correctAnswer: "It rewrites feature commits to branch off from the latest tip commit of main",
    explanation: "Rebase reapplies commits on top of another base tip, creating a linear history log."
  },
  {
    question: "What is a Fork on GitHub?",
    options: [
      "A branch created locally",
      "A copy of someone else's repository saved under your own GitHub account",
      "An installation command for packages",
      "A commit dispute resolution tool"
    ],
    correctAnswer: "A copy of someone else's repository saved under your own GitHub account",
    explanation: "Forks copy original repositories, letting you experiment, commit, and propose changes via Pull Requests safely."
  },
  {
    question: "Which command pushes local commits to a remote branch?",
    options: ["git push", "git pull --upload", "git publish", "git commit --remote"],
    correctAnswer: "git push",
    explanation: "'git push' writes local branch histories to the configured remote reference targets."
  },
  {
    question: "What is the 'reflog' in Git?",
    options: [
      "A log containing deleted code lines",
      "A local record tracking updates made to tips of branches and head references",
      "A remote file on GitHub server",
      "An encryption system for commits"
    ],
    correctAnswer: "A local record tracking updates made to tips of branches and head references",
    explanation: "'git reflog' records historical head switches, letting you recover deleted branches or dangling commits easily."
  },
  {
    question: "What is the correct syntax to link a local repository to a remote repository?",
    options: [
      "git remote add origin <url>",
      "git remote link origin <url>",
      "git link remote <url>",
      "git clone --link <url>"
    ],
    correctAnswer: "git remote add origin <url>",
    explanation: "'git remote add <name> <url>' maps remote repositories to local tracking identifiers (default: origin)."
  }
];

async function seedDevOpsLevelAssessments() {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('⚠️ MongoDB connection not active inside script. Connection must be pre-established.');
      return;
    }

    const devopsDomain = await Domain.findOne({ slug: 'devops' });
    if (!devopsDomain) {
      console.log('⚠️ DevOps Domain not found. Seeding skipped.');
      return;
    }

    console.log('🌱 Seeding DevOps level-level assessments...');

    // Mapping:
    // Level 1: Networking Basics -> phaseNumber: 1
    // Level 2: Linux Fundamentals (Linux Basics) -> phaseNumber: 0
    // Level 3: Git and GitHub -> phaseNumber: 2
    
    const levelsToSeed = [
      {
        phaseNum: 1, // Level 1 - Networking Basics
        title: "Networking Basics Final Assessment",
        passingPercentage: 70,
        maxAttempts: 3,
        timeLimitMinutes: 20,
        questions: level1Questions
      },
      {
        phaseNum: 0, // Level 2 - Linux Fundamentals (Basics)
        title: "Linux Fundamentals Final Assessment",
        passingPercentage: 70,
        maxAttempts: 3,
        timeLimitMinutes: 25,
        questions: level2Questions
      },
      {
        phaseNum: 2, // Level 3 - Git & GitHub
        title: "Git and GitHub Final Assessment",
        passingPercentage: 70,
        maxAttempts: 3,
        timeLimitMinutes: 25,
        questions: level3Questions
      }
    ];

    let count = 0;
    for (const level of levelsToSeed) {
      const phase = await Phase.findOne({ domainId: devopsDomain._id, phaseNumber: level.phaseNum });
      if (!phase) {
        console.log(`⚠️ Phase with number ${level.phaseNum} not found. Skipping assessment for this phase.`);
        continue;
      }

      // Upsert the level-level assessment (where moduleId is null and assignmentType is 'level')
      await DevOpsAssessment.findOneAndUpdate(
        { 
          roadmapId: devopsDomain._id, 
          levelId: phase._id, 
          assignmentType: 'level' 
        },
        {
          roadmapId: devopsDomain._id,
          levelId: phase._id,
          moduleId: null,
          assignmentType: 'level',
          title: level.title,
          passingPercentage: level.passingPercentage,
          maxAttempts: level.maxAttempts,
          timeLimitMinutes: level.timeLimitMinutes,
          isPublished: true,
          order: level.phaseNum,
          questions: level.questions
        },
        { upsert: true, new: true }
      );
      count++;
    }

    console.log(`✅ Seeded ${count} DevOps level-level assessments successfully!`);
  } catch (err) {
    console.error('❌ Failed to seed DevOps level assessments:', err.message);
    throw err;
  }
}

module.exports = seedDevOpsLevelAssessments;

if (require.main === module) {
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.join(__dirname, '../.env') });
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge';
  mongoose.connect(uri)
    .then(() => seedDevOpsLevelAssessments())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('CLI level seed error:', err);
      process.exit(1);
    });
}
