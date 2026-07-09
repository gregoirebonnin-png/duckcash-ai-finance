import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: join(app.getAppPath(), '..', '.env') })
loadEnv({ path: join(process.cwd(), '.env') })

let mainWindow: BrowserWindow | null = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'default',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('pl-tool', process.execPath, [process.argv[1]])
  }
} else {
  app.setAsDefaultProtocolClient('pl-tool')
}

app.whenReady().then(() => {
  app.on('browser-window-created', (_, window) => {
    // dev tools shortcut in dev mode
    if (isDev) {
      window.webContents.on('before-input-event', (event, input) => {
        if (input.type === 'keyDown' && input.key === 'F12') {
          window.webContents.openDevTools()
        }
      })
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('open-url', (event, url) => {
  event.preventDefault()
  if (mainWindow) {
    mainWindow.webContents.send('oauth-callback', url)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('get-app-version', () => app.getVersion())

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2'

ipcMain.handle('claude-chat', async (_event, { messages, projectsContext }: { messages: ChatMessage[]; projectsContext: string }) => {
  const systemPrompt = `Tu es DuckCash, un assistant expert en gestion de P&L (Profit & Loss) pour une agence de conseil.
Tu aides les utilisateurs à analyser leurs projets, suivre leurs budgets, comprendre leurs marges et optimiser leur rentabilité.

Voici l'état actuel des projets dans l'application :
${projectsContext}

Réponds toujours en français. Sois concis, précis et orienté action. Si l'utilisateur parle d'un projet spécifique, appuie-toi sur les données ci-dessus.`

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      return { error: `Ollama a retourné une erreur ${res.status} : ${body}` }
    }

    const data = await res.json() as { message?: { content?: string }; error?: string }
    if (data.error) return { error: `Ollama : ${data.error}` }
    return { text: data.message?.content ?? '' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed')) {
      return { error: `Ollama n'est pas lancé. Démarrez-le avec la commande : ollama serve` }
    }
    return { error: `Erreur Ollama : ${msg}` }
  }
})
