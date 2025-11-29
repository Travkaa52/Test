window.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================
    // 1. БЛОК ИНИЦИАЛИЗАЦИИ И ЗАГРУЗКИ ДАННЫХ
    // Данные загружаются из localStorage или из values.js при первом запуске.
    // ==========================================================
    
    const currentFio = localStorage.getItem('saved_fio') || fio;
    const currentBirth = localStorage.getItem('saved_birthDate') || birth; 
    const currentPhotoPassport = localStorage.getItem('saved_photo_passport') || photo_passport;
    const currentSignature = localStorage.getItem('saved_signature') || ''; 

    var mapping = {
        '#name': currentFio,            
        '#nameEn': fio_en,
        '#birthDate': currentBirth,     
        '#rnokpp': rnokpp,
        '#pravaNnumber': prava_number,

        '#university': university,
        '#fakultat': fakultet,
        '#stepen_dip': `Диплом ${stepen_dip}`,
        '#univer_dip': univer_dip,
        '#dayout_dip': dayout_dip,

        '#special_dip': special_dip,
        '#number_dip': number_dip,
        '#placeBirth': live,
        '#srokPrav': prava_date_out,
        '#adress': bank_adress,

        '#dateGiveZ': dateGiveZ,
        '#dateOutZ': dateOutZ,

        '#sex': sex,
        '#sexEn': sex_en,
        '#textName': currentFio.split(' ')[1], 
        '#zagran_number': zagran_number,
        '#nomerStudy': student_number,

        '#vidanoStudy': student_date_give,
        '#diusnuyDoStudy': student_date_out,
        '#formaStudy': form,
        '#rightsCategories': rights_categories,
        '#dateGive': date_give,

        '#dateGivePrava': prava_date_give,
        '#dateOut': date_out,
        '#nomerPasport': pass_number,
        '#organ': organ,
        '#uznr': uznr,
        
        '#legalAdress': legalAdress,
        '#registeredOn': registeredOn,
        '#pravaOrgan': pravaOrgan
    };

    // Применяем текстовые данные ко всем элементам
    Object.keys(mapping).forEach(function(selector) {
        document.querySelectorAll(selector).forEach(function(el) {
            if (mapping.hasOwnProperty(selector) && mapping[selector] !== undefined && mapping[selector] !== null) {
                el.textContent = mapping[selector];
            } else {
                el.textContent = "No data";
            }
        });
    });

    var photoMapping = {
        '#imgPassport': currentPhotoPassport, 
        '#imgRights':   photo_rights,
        '#imgStudent':  photo_students,
        '#imgZagran':   photo_zagran
    };

    // Меняем src для каждой соответствующей картинки
    Object.keys(photoMapping).forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (img) {
            if (
                photoMapping.hasOwnProperty(selector) 
                && photoMapping[selector] !== undefined 
                && photoMapping[selector] !== null
            ) {
                img.src = photoMapping[selector];
            }
        });
    });
 
    // ==========================================================
    // 2. БЛОК ЛОГИКИ РЕДАКТИРОВАНИЯ И СОХРАНЕНИЯ (ИСПРАВЛЕНО)
    // ==========================================================

    // 1. Получение элементов формы и модального окна
    const modalEditProfile = document.getElementById('edit-profile-modal');
    const openEditProfileButton = document.getElementById('openEditProfile');
    const closeEditProfileButton = document.querySelector('.close_block[data-index="edit-profile"]');
    const saveButton = document.getElementById('saveChangesButton');
    const inputName = document.getElementById('newName');
    const inputBirthDate = document.getElementById('newBirthDate');
    const inputPhoto = document.getElementById('newPhoto');
    const currentPhotoPreview = document.getElementById('currentPhotoPreview');
    const overlay = document.getElementById('overlay'); 

    // 2. Элементы на странице, которые нужно обновлять
    const mainTextName = document.getElementById('textName'); 
    const passportNames = document.querySelectorAll('#name'); 
    const birthDates = document.querySelectorAll('#birthDate'); 
    const passportImgs = document.querySelectorAll('#imgPassport');


    // 3. Логика открытия модального окна (Исправлено для CSS-анимации снизу)
    if (openEditProfileButton) {
        openEditProfileButton.addEventListener('click', function() {
            // Заполняем форму текущими данными перед открытием
            if (passportNames[0]) inputName.value = passportNames[0].textContent.trim();
            
            // Преобразуем формат даты из DD.MM.YYYY в YYYY-MM-DD для input type="date"
            if (birthDates[0]) {
                const currentBirthDate = birthDates[0].textContent.trim();
                const dateParts = currentBirthDate.split('.');
                if (dateParts.length === 3) {
                     inputBirthDate.value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                }
            }
            
            if (passportImgs[0]) currentPhotoPreview.src = passportImgs[0].src;
            if (localStorage.getItem('saved_signature')) document.getElementById('newSignature').value = localStorage.getItem('saved_signature');


            // Активируем класс 'open'. CSS должен обеспечить выезд снизу.
            modalEditProfile.classList.add('open');
            if (overlay) overlay.classList.remove('hidden');
        });
    }

    // 4. Логика для предварительного просмотра нового фото
    inputPhoto.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentPhotoPreview.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // 5. Логика закрытия модального окна (Исправлено)
    if (closeEditProfileButton) {
        closeEditProfileButton.addEventListener('click', function() {
            // Удаляем класс 'open' для CSS-анимации заезда вниз
            modalEditProfile.classList.remove('open');
            if (overlay) overlay.classList.add('hidden');
        });
    }

    // 6. Логика сохранения изменений
    saveButton.addEventListener('click', function() {
        const newNameValue = inputName.value.trim();
        const newBirthDateValue = inputBirthDate.value;
        const newSignatureValue = document.getElementById('newSignature').value.trim();

        // 6.1. Обновление и СОХРАНЕНИЕ ФИО
        if (newNameValue) {
            const firstName = newNameValue.split(' ')[1] || newNameValue;
            if (mainTextName) mainTextName.textContent = firstName;
            passportNames.forEach(el => el.textContent = newNameValue);
            
            localStorage.setItem('saved_fio', newNameValue);
        }

        // 6.2. Обновление и СОХРАНЕНИЕ Даты рождения
        if (newBirthDateValue) {
            const parts = newBirthDateValue.split('-');
            const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;

            birthDates.forEach(el => el.textContent = formattedDate);
            
            localStorage.setItem('saved_birthDate', formattedDate); 
        }

        // 6.3. Обновление и СОХРАНЕНИЕ Фото
        if (inputPhoto.files && inputPhoto.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                passportImgs.forEach(el => el.src = e.target.result);
                localStorage.setItem('saved_photo_passport', e.target.result); 
            };
            reader.readAsDataURL(inputPhoto.files[0]);
        }
        
        // 6.4. Обновление и СОХРАНЕНИЕ Подписи
        if (newSignatureValue) {
            localStorage.setItem('saved_signature', newSignatureValue); 
        }

        // Закрытие модального окна (Исправлено)
        modalEditProfile.classList.remove('open');
        if (overlay) overlay.classList.add('hidden');
        
        // Вывод сообщения об успехе
        if (typeof showNotification === 'function') {
            showNotification('Дані документів успішно оновлено!');
        } else {
            alert('Дані документів успішно оновлено!');
        }
    });
});
