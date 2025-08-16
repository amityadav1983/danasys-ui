import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/public")
public class RegisterController {

    @PostMapping("/registerUser")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationRequest request) {
        // Logic to handle user registration
        // For now, just return a success message
        return ResponseEntity.ok("User registered successfully");
    }
}

// DTO for user registration request
class UserRegistrationRequest {
    private String email;
    private String password;
    private String fullname;
    private String contactInfo;

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }
}
