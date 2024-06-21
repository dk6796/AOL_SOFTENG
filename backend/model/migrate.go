package model

import (
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB){
	// db.Migrator().DropTable(&User{})
	// db.Migrator().DropTable(&Book{})
	// db.Migrator().DropTable(&Option{})
	// db.Migrator().DropTable(&Question{})
	// db.Migrator().DropTable(&BookHistory{})
	// db.Migrator().DropTable(&QuizResult{})

	// db.AutoMigrate(&User{})
	// db.AutoMigrate(&Book{})
	// db.AutoMigrate(&Question{})
	// db.AutoMigrate(&Option{})
	// db.AutoMigrate(&BookHistory{})
	// db.AutoMigrate(&QuizResult{})
	// db.AutoMigrate(&Voucher{})
	// db.AutoMigrate(&ExchangeVoucher{})
}