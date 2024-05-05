package erigonwatch

import (
	"embed"
	"io/fs"
)

//go:embed all:build
var assets embed.FS

func UIFiles() (fs.FS, error) {
	return fs.Sub(assets, "build")
}
