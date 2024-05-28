package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"fmt"
)

func GetBookHistory(db *gorm.DB, c *gin.Context) {
	var result []model.BookHistory

	err := db.Preload("User").
		Preload("Book").
		Find(&result).Error

	if err != nil {
		fmt.Println("Error fetching book history list:", err)
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read book history data")
		return
	}

	c.AsciiJSON(http.StatusOK, result)
}
