package controller

import (
	"net/http"
	"strconv"
	"fmt"
	"github.com/dk6796/backend/database"
	"github.com/dk6796/backend/model"
	"github.com/gin-gonic/gin"
)

func UploadBookController(c *gin.Context) {
	title := c.PostForm("title")
	author := c.PostForm("author")
	publisher := c.PostForm("publisher")
	totalPage := c.PostForm("totalPage")
	synopsis := c.PostForm("synopsis")
	coverBook := c.PostForm("coverBook")
	level := c.PostForm("level")
	category := c.PostForm("category")
	genre := c.PostForm("genre")
	filePDF := c.PostForm("file")

	fmt.Println(author, filePDF)

	// if title == "" || author == "" || publisher == "" || totalPage == "" || synopsis == "" || coverBook == "" || level == "" || category == "" || genre == "" {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "All fields must be filled"})
	// 	return
	// }

	// file, _, err := c.Request.FormFile("file")
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upload PDF"})
	// 	return
	// }
	// defer file.Close()

	// fileBytes, err := ioutil.ReadAll(file)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading file"})
	// 	return
	// }

	db := database.Connection()
	book := model.Book{
		Title:     title,
		Author:    author,
		Publisher: publisher,
		TotalPage: parseUint(totalPage),
		Synopsis:  synopsis,
		CoverBook: coverBook,
		Level:     parseUint(level),
		Category:  category,
		Genre:     genre,
		FilePDF:   filePDF,
	}

	if err := db.Create(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving book to database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully", "id": book.BookID})
}

func parseUint(s string) uint {
	var i uint64
	i, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		return 0
	}
	return uint(i)
}
