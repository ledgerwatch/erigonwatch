/*
 
      datadir string                 Data directory for the databases (default "/Users/dvovk/Library/Erigon")
      downloader.api.addr string     external downloader api network address, for example: 127.0.0.1:9093 serves remote downloader interface (default "127.0.0.1:9093")
      downloader.disable.ipv4        Turns off ipv6 for the downloader
      downloader.disable.ipv6        Turns off ipv6 for the downloader
  -h, help                           help for this command
      log.console.json               Format console logs with JSON
      log.console.verbosity string   Set the log level for console logs (default "info")
      log.delays                     Enable block delay logging
      log.dir.disable                disable disk logging
      log.dir.json                   Format file logs with JSON
      log.dir.path string            Path to store user and error logs to disk
      log.dir.prefix string          The file name prefix for logs stored to disk
      log.dir.verbosity string       Set the log verbosity for logs stored to disk (default "info")
      log.json                       Format console logs with JSON
      metrics                        Enable metrics collection and reporting
      metrics.addr string            Enable stand-alone metrics HTTP server listening interface (default "127.0.0.1")
      metrics.port int               Metrics HTTP server listening port (default 6060)
      nat string                     NAT port mapping mechanism (any|none|upnp|pmp|stun|extip:<IP>)
                                                         "" or "none"         Default - do not nat
                                                         "extip:77.12.33.4"   Will assume the local machine is reachable on the given IP
                                                         "any"                Uses the first auto-detected mechanism
                                                         "upnp"               Uses the Universal Plug and Play protocol
                                                         "pmp"                Uses NAT-PMP with an auto-detected gateway address
                                                         "pmp:192.168.0.1"    Uses NAT-PMP with the given gateway address
                                                         "stun"               Uses STUN to detect an external IP using a default server
                                                         "stun:<server>"      Uses STUN to detect an external IP using the given server (host:port)
                                       
      pprof                          Enable the pprof HTTP server
      pprof.addr string              pprof HTTP server listening interface (default "127.0.0.1")
      pprof.cpuprofile string        Write CPU profile to the given file
      pprof.port int                 pprof HTTP server listening port (default 6060)
      seedbox                        Turns downloader into independent (doesn't need Erigon) software which discover/download/seed new files - useful for Erigon network, and can work on very cheap hardware. It will: 1) download .torrent from webseed 2) download new files after upgrade 3) we planing add discovery of new files soon
      torrent.conns.perfile int      Number of connections per file (default 10)
      torrent.download.rate string   Bytes per second, example: 32mb (default "16mb")
      torrent.download.slots int     Amount of files to download in parallel. If network has enough seeders 1-3 slot enough, if network has lack of seeders increase to 5-7 (too big value will slow down everything). (default 3)
      torrent.maxpeers int           Unused parameter (reserved for future use) (default 100)
      torrent.port int               Port to listen and serve BitTorrent protocol (default 42069)
      torrent.staticpeers string     Comma separated enode URLs to connect to
      torrent.upload.rate string     Bytes per second, example: 32mb (default "4mb")
      torrent.verbosity int          0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=detail (must set verbosity to equal or higher level and has default: 2) (default 2)
      trace string                   Write execution trace to the given file
      verbosity string               Set the log level for console logs (default "info")
      verify                         Verify snapshots on startup. It will not report problems found, but re-download broken pieces.
      verify.failfast                Stop on first found error. Report it and exit
      verify.files string            Limit list of files to verify
      webseed string                 Comma-separated URL's, holding metadata about network-support infrastructure (like S3 buckets with snapshots, bootnodes, etc...)

Use " [command] help" for more information about a command.
*/

export const downloaderFlags = [
    //"chain",
    "datadir",
    "downloader.api.addr",
    "downloader.disable.ipv4",
    "downloader.disable.ipv6",
    /*"help",
    "log.console.json",
    "log.console.verbosity",
    "log.delays",
    "log.dir.disable",
    "log.dir.json",
    "log.dir.path",
    "log.dir.prefix",
    "log.dir.verbosity",
    "log.json",
    "metrics",
    "metrics.addr",
    "metrics.port",*/
    "nat",
    "pprof",
    "pprof.addr",
    "pprof.cpuprofile",
    "pprof.port",
    "seedbox",
    "torrent.conns.perfile",
    "torrent.download.rate",
    "torrent.download.slots",
    "torrent.maxpeers",
    "torrent.port",
    "torrent.staticpeers",
    "torrent.upload.rate",
    "torrent.verbosity",
    "trace",
    "verbosity",
    "verify",
    "verify.failfast",
    "verify.files",
    "webseed",
]