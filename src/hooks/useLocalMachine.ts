import { useState, useCallback } from 'react'
import { machineApi, type FileEntry, type SystemInfo, type DockerContainer } from '@/services/api/machine'
import { toast } from 'sonner'

export function useLocalMachine() {
  const [currentPath, setCurrentPath] = useState('/')
  const [files, setFiles] = useState<FileEntry[]>([])
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [loading, setLoading] = useState(false)
  const [commandOutput, setCommandOutput] = useState('')

  const listFiles = useCallback(async (path: string) => {
    setLoading(true)
    try {
      const result = await machineApi.listFiles(path)
      setFiles(result.files)
      setCurrentPath(path)
    } catch (err) {
      console.error('Failed to list files:', err)
      toast.error('Failed to list files - backend not connected')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [])

  const executeCommand = useCallback(async (command: string, cwd?: string) => {
    try {
      const result = await machineApi.executeCommand(command, cwd)
      setCommandOutput(prev => prev + `\n$ ${command}\n${result.output}`)
      return result
    } catch (err) {
      console.error('Command execution failed:', err)
      toast.error('Command execution failed - backend not connected')
      return null
    }
  }, [])

  const loadSystemInfo = useCallback(async () => {
    try {
      const info = await machineApi.getSystemInfo()
      setSystemInfo(info)
    } catch (err) {
      console.error('Failed to load system info:', err)
      setSystemInfo(null)
    }
  }, [])

  const loadDockerStatus = useCallback(async () => {
    try {
      const result = await machineApi.getDockerStatus()
      setContainers(result.containers)
    } catch (err) {
      console.error('Failed to load docker status:', err)
      setContainers([])
    }
  }, [])

  return {
    currentPath,
    files,
    systemInfo,
    containers,
    loading,
    commandOutput,
    listFiles,
    executeCommand,
    loadSystemInfo,
    loadDockerStatus,
    setCommandOutput,
  }
}
