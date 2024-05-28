package controller

import (
	"net/http"
    	"github.com/gin-gonic/gin"
    	"github.com/dk6796/backend/database"
    	"github.com/dk6796/backend/model"
)

func QuizResultController(c *gin.Context){

	var body model.QuizResult

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
			"details": c.Errors.String(),
		})
		return
	}

	db := database.Connection()
	var result model.QuizResult

	result = model.QuizResult{
		BookHistoryID: body.BookHistoryID,
		TotalCorrect: body.TotalCorrect,
		CorrectStreak: body.CorrectStreak,
		CoinEarned: body.CoinEarned,
	}
	db.Create(&result)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
	})

}