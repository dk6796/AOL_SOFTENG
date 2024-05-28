package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetQuizResultByID(db *gorm.DB, c *gin.Context) {
	var result model.QuizResult

	id := c.Query("id")

	err := db.Where("book_history_id = ?", id).Find(&result).Error

	if err != nil {
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read result data")
		return
	}

	c.AsciiJSON(http.StatusOK, result)
}

