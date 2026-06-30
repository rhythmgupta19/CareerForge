const TerminalLab = require('../models/TerminalLab');
const TerminalProgress = require('../models/TerminalProgress');

// VFS Helper Functions
const resolvePath = (currentDir, targetPath) => {
  if (!targetPath) return currentDir;
  
  let parts;
  if (targetPath.startsWith('/')) {
    parts = targetPath.split('/').filter(Boolean);
  } else {
    parts = currentDir.split('/').filter(Boolean).concat(targetPath.split('/').filter(Boolean));
  }
  
  const resolvedParts = [];
  for (const part of parts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      resolvedParts.pop();
    } else {
      resolvedParts.push(part);
    }
  }
  
  return '/' + resolvedParts.join('/');
};

const getItem = (vfs, resolvedPath) => {
  if (resolvedPath === '/') return { type: 'dir', children: vfs };
  
  const parts = resolvedPath.split('/').filter(Boolean);
  let current = { type: 'dir', children: vfs };
  
  for (const part of parts) {
    if (!current || current.type !== 'dir' || !current.children) return null;
    current = current.children[part];
  }
  
  return current || null;
};

const setItem = (vfs, resolvedPath, item) => {
  const parts = resolvedPath.split('/').filter(Boolean);
  if (parts.length === 0) return false;
  
  let current = vfs;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || current[part].type !== 'dir') {
      current[part] = { type: 'dir', children: {} };
    }
    if (!current[part].children) current[part].children = {};
    current = current[part].children;
  }
  
  const lastPart = parts[parts.length - 1];
  current[lastPart] = item;
  return true;
};

const removeItem = (vfs, resolvedPath) => {
  const parts = resolvedPath.split('/').filter(Boolean);
  if (parts.length === 0) return false;
  
  let current = vfs;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || current[part].type !== 'dir' || !current[part].children) return false;
    current = current[part].children;
  }
  
  const lastPart = parts[parts.length - 1];
  if (current[lastPart]) {
    delete current[lastPart];
    return true;
  }
  return false;
};

const getAllFiles = (vfs, currentPath = '') => {
  let files = [];
  for (const [name, item] of Object.entries(vfs)) {
    const itemPath = `${currentPath}/${name}`;
    if (item.type === 'file') {
      files.push({ path: itemPath, content: item.content || '' });
    } else if (item.type === 'dir' && item.children) {
      files = files.concat(getAllFiles(item.children, itemPath));
    }
  }
  return files;
};

// Command Parser
const parseCommand = (commandStr) => {
  const cleanCmd = commandStr.trim();
  let cmd = cleanCmd;
  let redirect = null;
  let redirectFile = null;
  
  if (cmd.includes('>>')) {
    const parts = cmd.split('>>');
    cmd = parts[0].trim();
    redirect = 'append';
    redirectFile = parts[1].trim();
  } else if (cmd.includes('>')) {
    const parts = cmd.split('>');
    cmd = parts[0].trim();
    redirect = 'overwrite';
    redirectFile = parts[1].trim();
  }
  
  const args = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < cmd.length; i++) {
    const char = cmd[i];
    if ((char === '"' || char === "'") && (i === 0 || cmd[i - 1] !== '\\')) {
      if (inQuotes && char === quoteChar) {
        inQuotes = false;
      } else if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      }
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        args.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) args.push(current);
  
  return { args, redirect, redirectFile };
};

// Command Executor
const executeCommand = async (session, commandStr) => {
  const { args, redirect, redirectFile } = parseCommand(commandStr);
  if (args.length === 0) return { output: '', currentDir: session.currentDir };
  
  const cmd = args[0].toLowerCase();
  let output = '';
  
  switch (cmd) {
    case 'help':
      output = `CareerForge Virtual Linux Terminal Sandbox
Supported Commands:
  Linux Basics: pwd, ls, cd, mkdir, touch, cat, echo, cp, mv, rm, grep, find, chmod, clear
  Git:          git init, git status, git add, git commit, git branch, git checkout
  Docker:       docker ps, docker images, docker run, docker build
  Kubernetes:   kubectl get pods, kubectl describe pod, kubectl apply -f
`;
      break;
      
    case 'pwd':
      output = session.currentDir;
      break;
      
    case 'ls': {
      const showAll = args.includes('-a') || args.includes('-la');
      const showLong = args.includes('-l') || args.includes('-la');
      const targetDir = args.filter(a => !a.startsWith('-') && a !== 'ls')[0] || '';
      const resolved = resolvePath(session.currentDir, targetDir);
      const item = getItem(session.vfs, resolved);
      
      if (!item || item.type !== 'dir') {
        output = `ls: cannot access '${targetDir}': No such directory`;
      } else {
        const lines = [];
        for (const [name, child] of Object.entries(item.children || {})) {
          if (!showAll && name.startsWith('.')) continue;
          if (showLong) {
            const size = child.type === 'file' ? (child.content || '').length : 4096;
            const perms = child.type === 'dir' ? `drwxr-xr-x` : `-rw-r--r--`;
            lines.push(`${perms} student student ${size} Jun 30 2026 ${name}`);
          } else {
            lines.push(name);
          }
        }
        output = lines.join(showLong ? '\n' : '  ');
      }
      break;
    }
      
    case 'cd': {
      const targetDir = args[1] || '/home/student';
      const resolved = resolvePath(session.currentDir, targetDir);
      const item = getItem(session.vfs, resolved);
      
      if (!item || item.type !== 'dir') {
        output = `cd: no such file or directory: ${targetDir}`;
      } else {
        session.currentDir = resolved;
      }
      break;
    }
      
    case 'mkdir': {
      const name = args[1];
      if (!name) {
        output = 'mkdir: missing operand';
      } else {
        const resolved = resolvePath(session.currentDir, name);
        if (getItem(session.vfs, resolved)) {
          output = `mkdir: cannot create directory '${name}': File exists`;
        } else {
          setItem(session.vfs, resolved, { type: 'dir', children: {} });
        }
      }
      break;
    }
      
    case 'touch': {
      const name = args[1];
      if (!name) {
        output = 'touch: missing file operand';
      } else {
        const resolved = resolvePath(session.currentDir, name);
        const item = getItem(session.vfs, resolved);
        if (!item) {
          setItem(session.vfs, resolved, { type: 'file', content: '', perms: '644' });
        }
      }
      break;
    }
      
    case 'cat': {
      const name = args[1];
      if (!name) {
        output = 'cat: missing file operand';
      } else {
        const resolved = resolvePath(session.currentDir, name);
        const item = getItem(session.vfs, resolved);
        if (!item || item.type !== 'file') {
          output = `cat: ${name}: No such file`;
        } else {
          output = item.content || '';
        }
      }
      break;
    }
      
    case 'echo': {
      const textIndex = args.indexOf('echo');
      const text = args.slice(1).join(' ');
      output = text;
      break;
    }
      
    case 'cp': {
      const src = args[1];
      const dest = args[2];
      if (!src || !dest) {
        output = 'cp: missing file operand';
      } else {
        const resolvedSrc = resolvePath(session.currentDir, src);
        const resolvedDest = resolvePath(session.currentDir, dest);
        const srcItem = getItem(session.vfs, resolvedSrc);
        if (!srcItem) {
          output = `cp: cannot stat '${src}': No such file or directory`;
        } else {
          // deep copy
          const copy = JSON.parse(JSON.stringify(srcItem));
          setItem(session.vfs, resolvedDest, copy);
        }
      }
      break;
    }
      
    case 'mv': {
      const src = args[1];
      const dest = args[2];
      if (!src || !dest) {
        output = 'mv: missing file operand';
      } else {
        const resolvedSrc = resolvePath(session.currentDir, src);
        const resolvedDest = resolvePath(session.currentDir, dest);
        const srcItem = getItem(session.vfs, resolvedSrc);
        if (!srcItem) {
          output = `mv: cannot stat '${src}': No such file or directory`;
        } else {
          const copy = JSON.parse(JSON.stringify(srcItem));
          setItem(session.vfs, resolvedDest, copy);
          removeItem(session.vfs, resolvedSrc);
        }
      }
      break;
    }
      
    case 'rm': {
      const isRecursive = args.includes('-r') || args.includes('-rf') || args.includes('-f');
      const name = args.filter(a => !a.startsWith('-') && a !== 'rm')[0];
      if (!name) {
        output = 'rm: missing operand';
      } else {
        const resolved = resolvePath(session.currentDir, name);
        const item = getItem(session.vfs, resolved);
        if (!item) {
          output = `rm: cannot remove '${name}': No such file or directory`;
        } else if (item.type === 'dir' && !isRecursive) {
          output = `rm: cannot remove '${name}': Is a directory`;
        } else {
          removeItem(session.vfs, resolved);
        }
      }
      break;
    }
      
    case 'grep': {
      const pattern = args[1];
      const fileName = args[2];
      if (!pattern || !fileName) {
        output = 'grep: missing pattern or file operand';
      } else {
        const resolved = resolvePath(session.currentDir, fileName);
        const item = getItem(session.vfs, resolved);
        if (!item || item.type !== 'file') {
          output = `grep: ${fileName}: No such file`;
        } else {
          const lines = (item.content || '').split('\n');
          const matched = lines.filter(l => l.includes(pattern));
          output = matched.join('\n');
        }
      }
      break;
    }
      
    case 'find': {
      const path = args[1] || '.';
      const nameFlagIdx = args.indexOf('-name');
      const pattern = nameFlagIdx !== -1 ? args[nameFlagIdx + 1] : null;
      
      const resolved = resolvePath(session.currentDir, path);
      const rootItem = getItem(session.vfs, resolved);
      if (!rootItem) {
        output = `find: '${path}': No such file or directory`;
      } else {
        const all = getAllFiles(rootItem.children || {}, resolved);
        let matched = all.map(f => f.path);
        if (pattern) {
          const glob = pattern.replace(/\*/g, '.*');
          const regex = new RegExp(`^${glob}$`);
          matched = matched.filter(p => regex.test(p.split('/').pop()));
        }
        output = matched.join('\n');
      }
      break;
    }
      
    case 'chmod': {
      const perms = args[1];
      const name = args[2];
      if (!perms || !name) {
        output = 'chmod: missing operand';
      } else {
        const resolved = resolvePath(session.currentDir, name);
        const item = getItem(session.vfs, resolved);
        if (!item) {
          output = `chmod: cannot access '${name}': No such file or directory`;
        } else {
          item.perms = perms;
        }
      }
      break;
    }
      
    case 'clear':
      output = '__CLEAR__';
      break;
      
    case 'git': {
      const gitCmd = args[1];
      if (!gitCmd) {
        output = 'Usage: git <command> [<args>]';
      } else if (gitCmd === 'init') {
        session.git.initialized = true;
        setItem(session.vfs, resolvePath(session.currentDir, '.git'), { type: 'dir', children: {} });
        output = 'Initialized empty Git repository';
      } else {
        if (!session.git.initialized) {
          output = 'fatal: not a git repository (or any of the parent directories): .git';
        } else {
          switch (gitCmd) {
            case 'status': {
              const lines = [`On branch ${session.git.currentBranch || 'main'}`];
              if (session.git.staged.length > 0) {
                lines.push('Changes to be committed:');
                lines.push('  (use "git restore --staged <file>..." to unstage)');
                session.git.staged.forEach(f => lines.push(`\tnew file:   ${f}`));
              } else {
                lines.push('nothing to commit, working tree clean');
              }
              output = lines.join('\n');
              break;
            }
            case 'add': {
              const file = args[2];
              if (!file) {
                output = 'Nothing specified, nothing added.';
              } else {
                const resolved = resolvePath(session.currentDir, file);
                const item = getItem(session.vfs, resolved);
                if (!item) {
                  output = `fatal: pathspec '${file}' did not match any files`;
                } else {
                  if (!session.git.staged.includes(file)) {
                    session.git.staged.push(file);
                  }
                  output = `add '${file}'`;
                }
              }
              break;
            }
            case 'commit': {
              const mIdx = args.indexOf('-m');
              const msg = mIdx !== -1 ? args[mIdx + 1] : 'commit';
              if (session.git.staged.length === 0) {
                output = 'nothing to commit, working tree clean';
              } else {
                const commit = {
                  hash: Math.random().toString(16).substring(2, 9),
                  msg,
                  files: [...session.git.staged],
                  date: new Date()
                };
                session.git.commits.push(commit);
                session.git.staged = [];
                output = `[main ${commit.hash}] ${msg}\n ${commit.files.length} file changed`;
              }
              break;
            }
            case 'branch': {
              const name = args[2];
              if (!name) {
                output = (session.git.branches || ['main']).map(b => b === session.git.currentBranch ? `* ${b}` : `  ${b}`).join('\n');
              } else {
                if (!session.git.branches.includes(name)) {
                  session.git.branches.push(name);
                }
              }
              break;
            }
            case 'checkout': {
              const name = args[2];
              if (!name) {
                output = 'fatal: branch name required';
              } else {
                if (session.git.branches.includes(name)) {
                  session.git.currentBranch = name;
                  output = `Switched to branch '${name}'`;
                } else {
                  output = `error: pathspec '${name}' did not match any file(s) known to git`;
                }
              }
              break;
            }
            default:
              output = `git command '${gitCmd}' is not simulated.`;
          }
        }
      }
      break;
    }
      
    case 'docker': {
      const sub = args[1];
      if (sub === 'ps') {
        const lines = ['CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES'];
        session.docker.containers.forEach(c => {
          lines.push(`${c.id}   ${c.image}   "${c.cmd}"   ${c.created}   Up 5 minutes   ${c.ports}   ${c.name}`);
        });
        output = lines.join('\n');
      } else if (sub === 'images') {
        const lines = ['REPOSITORY   TAG       IMAGE ID       CREATED        SIZE'];
        session.docker.images.forEach((img, idx) => {
          lines.push(`${img.split(':')[0]}       ${img.split(':')[1] || 'latest'}    ${Math.random().toString(16).substring(2, 10)}   3 days ago     75MB`);
        });
        output = lines.join('\n');
      } else if (sub === 'run') {
        const dIdx = args.indexOf('-d');
        const nameIdx = args.indexOf('--name');
        const name = nameIdx !== -1 ? args[nameIdx + 1] : `container-${Math.floor(Math.random() * 1000)}`;
        const pIdx = args.indexOf('-p');
        const ports = pIdx !== -1 ? args[pIdx + 1] : '80:80';
        
        const nonFlags = args.slice(2).filter(a => !a.startsWith('-') && a !== name && a !== ports);
        const image = nonFlags[0] || 'nginx:alpine';
        
        const container = {
          id: Math.random().toString(16).substring(2, 14),
          image,
          cmd: 'docker-entrypoint.sh',
          created: 'Just now',
          ports,
          name
        };
        session.docker.containers.push(container);
        output = container.id;
      } else if (sub === 'build') {
        const tIdx = args.indexOf('-t');
        const tag = tIdx !== -1 ? args[tIdx + 1] : 'my-app:latest';
        const dockerfilePath = resolvePath(session.currentDir, 'Dockerfile');
        const dockerfile = getItem(session.vfs, dockerfilePath);
        
        if (!dockerfile || dockerfile.type !== 'file') {
          output = 'Cannot find Dockerfile in current workspace context';
        } else {
          if (!session.docker.images.includes(tag)) {
            session.docker.images.push(tag);
          }
          output = `Sending build context to Docker daemon...\nStep 1/3 : FROM node\nSuccessfully built ${tag}`;
        }
      } else {
        output = 'Usage: docker [ps|images|run|build]';
      }
      break;
    }
      
    case 'kubectl': {
      const kSub = args[1];
      const resource = args[2];
      if (kSub === 'get') {
        if (resource === 'pods' || resource === 'pod') {
          const lines = ['NAME                     READY   STATUS    RESTARTS   AGE'];
          session.k8s.pods.forEach(p => {
            lines.push(`${p.name}   1/1     ${p.status}   0          2m`);
          });
          output = lines.join('\n');
        } else if (resource === 'deployments' || resource === 'deployment') {
          const lines = ['NAME             READY   UP-TO-DATE   AVAILABLE   AGE'];
          session.k8s.deployments.forEach(d => {
            lines.push(`${d.name}   1/1     1            1           5m`);
          });
          output = lines.join('\n');
        } else if (resource === 'services' || resource === 'svc') {
          const lines = ['NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE'];
          session.k8s.services.forEach(s => {
            lines.push(`${s.name}   ClusterIP   10.96.0.1    <none>        80/TCP    10m`);
          });
          output = lines.join('\n');
        } else {
          output = 'Usage: kubectl get [pods|deployments|services]';
        }
      } else if (kSub === 'describe') {
        const podName = args[3];
        const pod = session.k8s.pods.find(p => p.name === podName);
        if (!pod) {
          output = `Error from server (NotFound): pods "${podName}" not found`;
        } else {
          output = `Name:         ${pod.name}
Namespace:    default
Priority:     0
Node:         minikube/192.168.49.2
Start Time:   Tue, 30 Jun 2026 21:00:00 +0530
Labels:       run=${pod.name}
Status:       ${pod.status}
IP:           172.17.0.4
Containers:
  nginx:
    Container ID:   docker://${Math.random().toString(16).substring(2, 14)}
    Image:          nginx:alpine
    State:          Running
`;
        }
      } else if (kSub === 'apply') {
        const fIdx = args.indexOf('-f');
        const filename = fIdx !== -1 ? args[fIdx + 1] : null;
        if (!filename) {
          output = 'error: must specify one of -f';
        } else {
          const resolved = resolvePath(session.currentDir, filename);
          const item = getItem(session.vfs, resolved);
          if (!item || item.type !== 'file') {
            output = `error: the path "${filename}" does not exist`;
          } else {
            const content = item.content || '';
            const matchName = content.match(/name:\s*([^\s\n]+)/);
            const name = matchName ? matchName[1] : 'my-deployment';
            
            if (content.toLowerCase().includes('kind: service')) {
              session.k8s.services.push({ name });
              output = `service/${name} created`;
            } else {
              session.k8s.deployments.push({ name });
              session.k8s.pods.push({ name: `${name}-${Math.random().toString(16).substring(2, 7)}`, status: 'Running' });
              output = `deployment.apps/${name} created`;
            }
          }
        }
      } else {
        output = 'Usage: kubectl [get|describe|apply]';
      }
      break;
    }
      
    default:
      output = `bash: ${cmd}: command not found`;
  }
  
  // Handle file redirection if requested (overwrite > or append >>)
  if (redirect && redirectFile && cmd !== 'clear') {
    const resolved = resolvePath(session.currentDir, redirectFile);
    let item = getItem(session.vfs, resolved);
    if (!item) {
      item = { type: 'file', content: '', perms: '644' };
      setItem(session.vfs, resolved, item);
    }
    if (redirect === 'overwrite') {
      item.content = output + '\n';
    } else {
      item.content = (item.content || '') + output + '\n';
    }
    output = ''; // redirection hides stdout output in bash
  }
  
  session.history.push(commandStr);
  session.lastActive = new Date();
  
  return { output, currentDir: session.currentDir };
};

// Validate Lab State
const validateLabProgress = async (session, progress, labId) => {
  const lab = await TerminalLab.findOne({ labId });
  if (!lab) return false;
  
  let allRulesPassed = true;
  
  for (const rule of lab.validationRules) {
    let rulePassed = false;
    switch (rule.type) {
      case 'file_exists': {
        const resolved = resolvePath('/home/student', rule.path);
        const item = getItem(session.vfs, resolved);
        if (item && item.type === 'file') rulePassed = true;
        break;
      }
      case 'dir_exists': {
        const resolved = resolvePath('/home/student', rule.path);
        const item = getItem(session.vfs, resolved);
        if (item && item.type === 'dir') rulePassed = true;
        break;
      }
      case 'file_contains': {
        const resolved = resolvePath('/home/student', rule.path);
        const item = getItem(session.vfs, resolved);
        if (item && item.type === 'file' && (item.content || '').includes(rule.content)) rulePassed = true;
        break;
      }
      case 'git_initialized': {
        if (session.git && session.git.initialized) rulePassed = true;
        break;
      }
      case 'git_committed': {
        if (session.git && session.git.commits && session.git.commits.length > 0) rulePassed = true;
        break;
      }
      case 'docker_running': {
        if (session.docker && session.docker.containers) {
          const container = session.docker.containers.find(c => c.image.includes(rule.imageName));
          if (container) rulePassed = true;
        }
        break;
      }
      case 'k8s_applied': {
        if (session.k8s) {
          const pod = session.k8s.pods.find(p => p.name.includes(rule.resourceName));
          const deployment = session.k8s.deployments.find(d => d.name.includes(rule.resourceName));
          if (pod || deployment) rulePassed = true;
        }
        break;
      }
    }
    if (!rulePassed) {
      allRulesPassed = false;
      break;
    }
  }
  
  if (allRulesPassed && !progress.completedLabs.includes(labId)) {
    progress.completedLabs.push(labId);
    return { success: true, xp: lab.xpReward };
  }
  
  return { success: false, xp: 0 };
};

module.exports = {
  executeCommand,
  validateLabProgress
};
