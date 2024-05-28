package seed

import (
	"fmt"
	"github.com/dk6796/backend/model"
	"gorm.io/gorm"
	"golang.org/x/crypto/bcrypt"
)

func hashPassword1(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func SeedUser(db *gorm.DB){

	hashedPassword, er := hashPassword1("admin123")
	if er != nil {
		fmt.Println("Error hashing password:", er)
		return
	}
	
	user := []model.User{
		{
			FullName: "Admin",
			Email: "admin@gmail.com",
			Password: hashedPassword,
			Role: "Admin",
		},
	}

	db.Create(&user)
}