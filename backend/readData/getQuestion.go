package readData

import (
	"net/http"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"fmt"
)

func GetAllQuestion(db *gorm.DB, c *gin.Context) {
	var question []model.Question

	err := db.Preload("Book").
		Find(&question).Error

	if err != nil {
		fmt.Println("Error fetching question list:", err)
		c.AsciiJSON(http.StatusInternalServerError, "Cannot read question data")
		return
	}

	c.AsciiJSON(http.StatusOK, question)
}
