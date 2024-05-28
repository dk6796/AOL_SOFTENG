package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetBook(db *gorm.DB, c *gin.Context) {
	var books []model.Book

	err := db.Find(&books).Error

	if err != nil {
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read book data")
		return
	}

	c.AsciiJSON(http.StatusOK, books)
}

func GetBookByLevel(db *gorm.DB, c *gin.Context) {
	var books []model.Book

	level := c.Query("level")
	category := c.Query("category")

	err := db.Where("level = ? AND category = ?", level, category).Find(&books).Error

	if err != nil {
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read book data")
		return
	}

	c.AsciiJSON(http.StatusOK, books)
}

func GetBookByID(db *gorm.DB, c *gin.Context) {
	var books model.Book

	id := c.Query("id")

	err := db.Where("book_id = ?", id).First(&books).Error

	if err != nil {
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read book data")
		return
	}

	c.AsciiJSON(http.StatusOK, books)
}