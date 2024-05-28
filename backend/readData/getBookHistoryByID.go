package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetBookHistoryByID(db *gorm.DB, c *gin.Context) {
	var history []model.BookHistory

	id := c.Query("id")
	err := db.Where("user_id = ?", id).Find(&history).Error
	if err != nil {
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read history data")
		return
	}

	c.AsciiJSON(http.StatusOK, history)
}

