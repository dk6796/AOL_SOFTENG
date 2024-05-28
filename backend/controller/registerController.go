package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/dk6796/backend/database"
	"github.com/dk6796/backend/model"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"regexp"
)

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func ValidateEmail(email string) bool {
	db := database.Connection()
	var user model.User
	if err := db.First(&user, "email = ?", email).Error; err != nil {
		return false
	}

	return true
}

func RegisterController(c *gin.Context){
	
	var body struct {
		FullName  			string
		DOB					string
		Email				string
		Password				string
		ConfirmPassword		string
		ProfilePict			string
		Role					string
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.FullName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nama lengkap tidak boleh kosong !",
		})
		return
		
	} else if body.DOB == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Tanggal lahir tidak boleh kosong !",
		})

		return
	}  

	
	if body.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email tidak boleh kosong",
		})

		return

	} else if ValidateEmail(body.Email) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email sudah digunakan",
		})

		return

	} else if body.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password tidak boleh kosong",
		})

		return

	} else if !regexp.MustCompile(`[A-Z]`).MatchString(body.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password minimal terdapat 1 huruf besar",
		})

		return

	} else if !regexp.MustCompile(`[a-z]`).MatchString(body.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password minimal terdapat 1 huruf kecil",
		})

		return
	} else if !regexp.MustCompile(`[0-9]`).MatchString(body.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password minimal terdapat 1 angka",
		})

		return
	} else if !regexp.MustCompile(`[!@#$%^&*(),.?":{}|<>]`).MatchString(body.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password minimal terdapat 1 simbol",
		})

		return

	}  else if len(body.Password) < 8 || len(body.Password) > 30 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Panjang password harus di antara 8 - 30",
		})

		return

	} else if body.ConfirmPassword == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password konfirmasi tidak boleh kosong",
		})

		return

	} else if body.Password != body.ConfirmPassword{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password konfirmasi tidak sama dengan password",
		})

		return

	} else if body.ProfilePict == "" {
		fmt.Println(body.ProfilePict)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Foto profil tidak boleh kosong",
		})

		return

	}

	hashedPassword, er := hashPassword(body.Password)
	if er != nil {
		fmt.Println("Error hashing password:", er)
		return
	}

	db := database.Connection()
	var user model.User
	user = model.User{
		FullName: body.FullName,
		DOB: body.DOB,
		Email: body.Email,
		Password: hashedPassword,
		ProfilePict: body.ProfilePict,
		TotalCoin: 0,
		Level: 1,
		Role: "user",
		SavePage: 0,
		SaveBookID: 0,
		BookCategory: "",
	}
	
	db.Create(&user)

	c.JSON(http.StatusOK, gin.H{
		"message": "Succesfull",
		"id": user.UserID,
	})
}