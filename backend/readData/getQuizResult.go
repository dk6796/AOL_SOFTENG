package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"fmt"
)

func GetQuizResult(db *gorm.DB, c *gin.Context) {
	var result []model.QuizResult

	err := db.Preload("BookHistory").
		Find(&result).Error

	if err != nil {
		fmt.Println("Error fetching quiz result list:", err)
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read quiz result data")
		return
	}

	c.AsciiJSON(http.StatusOK, result)
}
