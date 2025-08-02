# DevLog#1 Basic Character Move

Date: March 15, 2023
Person: Nguyên Khánh Trần

- Author
    - [x]  Kai
    - [ ]  Aogie

---

- CameraMovement Sample
    - CameraMovement Sample
    
    ```jsx
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;
    
    public class CameraMovement : MonoBehaviour
    {
        public Camera playerCamera;
        public Transform cameraTransform;
        public CharacterMovement GetCharacterMovement;
        public float zoomFOV;
        public float zoomStepTime;
        public float sprintFOV;
        public float sprintFOVStepTime;
        public float MouseSentivie;
    
        private float fov = 90f;
        private float sensY;
        private float sensX;
    
        private float xRotation;
        private float yRotation;
        
        private KeyCode zoomKey;
        private bool isZoomed;
        private CharacterMovement cc;
        private void Awake()
        {
            zoomKey = KeyCode.Mouse2;
        }
        void Start()
        {
            Cursor.lockState = CursorLockMode.Locked;
            cc = GetCharacterMovement;
            playerCamera.fieldOfView = fov;
            sensX = MouseSentivie;
            sensY = MouseSentivie;
        }
        void Update()
        {
    
                // Changes isZoomed when key is pressed
                // Behavior for hold to zoom
                if (!cc.isSprinting)
                {
                    if (Input.GetKeyDown(zoomKey))
                    {
                        isZoomed = true;
                    }
                    else if (Input.GetKeyUp(zoomKey))
                    {
                        isZoomed = false;
                    }
                }
            else
            {
                isZoomed = false;
                playerCamera.fieldOfView = Mathf.Lerp(playerCamera.fieldOfView, sprintFOV, sprintFOVStepTime * Time.deltaTime);
            }
    
                // Lerps camera.fieldOfView to allow for a smooth transistion
                if (isZoomed)
                {
                playerCamera.fieldOfView = Mathf.Lerp(playerCamera.fieldOfView, zoomFOV, zoomStepTime * Time.deltaTime);
                }
                else if (!isZoomed && !cc.isSprinting)
                {
                    playerCamera.fieldOfView = Mathf.Lerp(playerCamera.fieldOfView, fov, zoomStepTime * Time.deltaTime);
                }
            
            float mouseX = Input.GetAxisRaw("Mouse X") * Time.deltaTime * sensX;
            float mouseY = Input.GetAxisRaw("Mouse Y") * Time.deltaTime * sensY;
    
            yRotation += mouseX;
            xRotation -= mouseY;
    
            xRotation = Mathf.Clamp(xRotation, -90f, 90f);
            transform.rotation = Quaternion.Euler(xRotation, yRotation, 0);
            cameraTransform.rotation = Quaternion.Euler(0, yRotation, 0);
        }
    }
    ```
    
- Character Movement Sample
    - 
    
    ```jsx
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;
    using UnityEngine.UI;
    
    public class CharacterMovement : MonoBehaviour
    {
        public Rigidbody rigidBody;
        private Rigidbody rb;
    
        #region Movement Variables
        public Vector3 boxSize;
        public float maxDistance;
        public LayerMask layerMask;
        public bool playerCanMove = true;
        public float walkSpeed = 5f;
        public float maxVelocityChange = 10f;
    
        // Internal Variables
        private bool isWalking = false;
    
        #region Sprint
    
        public bool enableSprint = true;
        public bool unlimitedSprint = false;
        public KeyCode sprintKey = KeyCode.LeftShift;
        public float sprintSpeed = 7f;
        public float sprintDuration = 5f;
        public float sprintCooldown = .5f;
        public float sprintFOV = 80f;
        public float sprintFOVStepTime = 10f;
    
        // Sprint Bar
        public bool useSprintBar = true;
    
        // Internal Variables
        public bool isSprinting = false;
        private float sprintRemaining;
        private float sprintBarWidth;
        private float sprintBarHeight;
        private bool isSprintCooldown = false;
        private float sprintCooldownReset;
    
        #endregion
        #region Jump
    
        public bool enableJump = true;
        public KeyCode jumpKey = KeyCode.Space;
        public float jumpPower = 5f;
    
        // Internal Variables
        private bool isGrounded = false;
    
        #endregion
        #endregion
        #region Head Bob
    
        public bool enableHeadBob = true;
        public Transform joint;
        public float bobSpeed = 10f;
        public Vector3 bobAmount = new Vector3(.15f, .05f, 0f);
    
        // Internal 
        private float timer = 0;
        private Vector3 jointOriginalPos;
        #endregion
    
        void OnDrawGizmos()
        {
            Gizmos.color = Color.red;
            Gizmos.DrawCube(transform.position - transform.up * maxDistance, boxSize);
        }
    
        private void Awake()
        {
            rigidBody = GetComponent<Rigidbody>();
            rb = rigidBody;
            jointOriginalPos = joint.localPosition;
            if (!unlimitedSprint){
                sprintRemaining = sprintDuration;
                sprintCooldownReset = sprintCooldown;
            }
        }
    
        void Update()
        {
    
            #region Sprint
    
                if (isSprinting)
                {
                  
    
                // Drain sprint remaining while sprinting
                if (!unlimitedSprint)
                    {
                        sprintRemaining -= 1 * Time.deltaTime;
                        if (sprintRemaining <= 0)
                        {
                            isSprinting = false;
                            isSprintCooldown = true;
                        }
                    }
                }
                else
                {
                    // Regain sprint while not sprinting
                    sprintRemaining = Mathf.Clamp(sprintRemaining += 1 * Time.deltaTime, 0, sprintDuration);
                }
    
                // Handles sprint cooldown 
                // When sprint remaining == 0 stops sprint ability until hitting cooldown
                if (isSprintCooldown)
                {
                    sprintCooldown -= 1 * Time.deltaTime;
                    if (sprintCooldown <= 0)
                    {
                        isSprintCooldown = false;
                    }
                }
                else
                {
                    sprintCooldown = sprintCooldownReset;
                }
    
           
    
            #endregion
    
            #region Jump
    
            // Gets input and calls jump method
            if (Input.GetKeyDown(jumpKey) && isGrounded)
            {
                Jump();
            }
    
            #endregion
    
            CheckGround();
    
            HeadBob();
        }
        void FixedUpdate()
        {
            #region Movement
    
            if (isGrounded)
            {
                // Calculate how fast we should be moving
                Vector3 targetVelocity = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
    
                // Checks if player is walking and isGrounded
                // Will allow head bob
                if (targetVelocity.x != 0 || targetVelocity.z != 0 && isGrounded)
                {
                    isWalking = true;
                }
                else
                {
                    isWalking = false;
                }
    
                // All movement calculations shile sprint is active
                if (enableSprint && Input.GetKey(sprintKey) && sprintRemaining > 0f && !isSprintCooldown)
                {
                    targetVelocity = transform.TransformDirection(targetVelocity) * sprintSpeed;
    
                    // Apply a force that attempts to reach our target velocity
                    Vector3 velocity = rb.velocity;
                    Vector3 velocityChange = (targetVelocity - velocity);
                    velocityChange.x = Mathf.Clamp(velocityChange.x, -maxVelocityChange, maxVelocityChange);
                    velocityChange.z = Mathf.Clamp(velocityChange.z, -maxVelocityChange, maxVelocityChange);
                    velocityChange.y = 0;
    
                    // Player is only moving when valocity change != 0
                    // Makes sure fov change only happens during movement
                    if (velocityChange.x != 0 || velocityChange.z != 0)
                    {
                        isSprinting = true;
    
                        
                    }
    
                    rb.AddForce(velocityChange, ForceMode.VelocityChange);
                }
                // All movement calculations while walking
                else
                {
                    isSprinting = false;
    
                    
    
                    targetVelocity = transform.TransformDirection(targetVelocity) * walkSpeed;
    
                    // Apply a force that attempts to reach our target velocity
                    Vector3 velocity = rb.velocity;
                    Vector3 velocityChange = (targetVelocity - velocity);
                    velocityChange.x = Mathf.Clamp(velocityChange.x, -maxVelocityChange, maxVelocityChange);
                    velocityChange.z = Mathf.Clamp(velocityChange.z, -maxVelocityChange, maxVelocityChange);
                    velocityChange.y = 0;
    
                    rb.AddForce(velocityChange, ForceMode.VelocityChange);
                }
            }
    
            #endregion
        }
        private void CheckGround()
        {
    
            if (Physics.BoxCast(transform.position,
                boxSize, -transform.up, transform.rotation,
                maxDistance, layerMask))
            {
                isGrounded = false ;
            }
            else
            {
                isGrounded = true;
            }
        }
    
        private void Jump()
        {
            if (isGrounded)
            {
                rb.AddForce(0f, jumpPower, 0f, ForceMode.Impulse);
                isGrounded = false;
            }
        }
    
        private void HeadBob()
        {
            if (isWalking)
            {
                // Calculates HeadBob speed during sprint
                if (isSprinting)
                {
                    timer += Time.deltaTime * (bobSpeed + sprintSpeed);
                }
                // Calculates HeadBob speed during walking
                else
                {
                    timer += Time.deltaTime * bobSpeed;
                }
                // Applies HeadBob movement
                joint.localPosition = new Vector3(jointOriginalPos.x + Mathf.Sin(timer) * bobAmount.x, jointOriginalPos.y + Mathf.Sin(timer) * bobAmount.y, jointOriginalPos.z + Mathf.Sin(timer) * bobAmount.z);
            }
            else
            {
                // Resets when play stops movinsg
                timer = 0;
                joint.localPosition = new Vector3(Mathf.Lerp(joint.localPosition.x, jointOriginalPos.x, Time.deltaTime * bobSpeed), Mathf.Lerp(joint.localPosition.y, jointOriginalPos.y, Time.deltaTime * bobSpeed), Mathf.Lerp(joint.localPosition.z, jointOriginalPos.z, Time.deltaTime * bobSpeed));
            }
        }
    }
    ```
    

### Preference

[](https://www.notion.so)

[](https://www.notion.so)

[](https://www.notion.so)