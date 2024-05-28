package controller

import (
	"net/http"
    	"github.com/gin-gonic/gin"
    	"github.com/dk6796/backend/database"
    	"github.com/dk6796/backend/model"
	"fmt"
)

func AddQuestionController(c *gin.Context){

	var body model.Question

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
			"details": c.Errors.String(),
		})
		return
	}

	fmt.Printf("Received BookID: %d", body.BookID)

	db := database.Connection()
	var question model.Question

	question = model.Question{
		BookID: body.BookID,
		QuizQuestion: body.QuizQuestion,
	}
	db.Create(&question)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
		"questionID": question.QuestionID,
	})

}